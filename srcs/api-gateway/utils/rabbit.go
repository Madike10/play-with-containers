package utils

import (
	"encoding/json"
	"log"
	"time"

	"github.com/streadway/amqp"
)

type BillingRequest struct {
	UserID        string `json:"user_id"`
	NumberOfItems string `json:"number_of_items"`
	TotalAmount   string `json:"total_amount"`
}

type RabbitMQClient struct {
	connection  *amqp.Connection
	channel     *amqp.Channel
	queue       amqp.Queue
	config      Config
	isConnected bool
}

func NewRabbitMQClient() *RabbitMQClient {
	return &RabbitMQClient{
		isConnected: false,
	}
}

// Fonction helper pour vérifier les appels de amqp
func failOnError(err error, msg string) {
	if err != nil {
		log.Printf("%s: %s", msg, err)
	}
}

// Connexion au serveur RabbitMQ avec reconnexion automatique
func (receiver *RabbitMQClient) Connect(config Config) error {
	receiver.config = config
	return receiver.connectInternal()
}

func (receiver *RabbitMQClient) connectInternal() error {
	if receiver.isConnected {
		return nil
	}

	var err error
	// Fermer les connexions précédentes si elles existent
	receiver.Close()

	// Se connecter à RabbitMQ
	receiver.connection, err = amqp.Dial(receiver.config.RabbitMQURL)
	if err != nil {
		failOnError(err, "Failed to connect to RabbitMQ")
		return err
	}

	// Configurer un handler pour détecter les fermetures de connexion
	go func() {
		// Attendre que la connexion soit fermée
		<-receiver.connection.NotifyClose(make(chan *amqp.Error))
		log.Println("RabbitMQ connection closed - attempting reconnect...")
		receiver.isConnected = false

		// Tentative de reconnexion avec backoff
		backoff := 1 * time.Second
		maxBackoff := 30 * time.Second

		for !receiver.isConnected {
			time.Sleep(backoff)
			if err := receiver.connectInternal(); err != nil {
				log.Printf("Failed to reconnect to RabbitMQ: %s", err)
				// Augmenter le backoff jusqu'à maxBackoff
				if backoff < maxBackoff {
					backoff *= 2
				}
			}
		}
	}()

	// Ouvrir un canal RabbitMQ
	receiver.channel, err = receiver.connection.Channel()
	if err != nil {
		receiver.connection.Close()
		failOnError(err, "Failed to open a channel")
		return err
	}

	// Déclarer la queue
	receiver.queue, err = receiver.channel.QueueDeclare(
		receiver.config.QueueName,
		false, false, false, false, nil,
	)
	if err != nil {
		receiver.channel.Close()
		receiver.connection.Close()
		failOnError(err, "Failed to declare a queue")
		return err
	}

	receiver.isConnected = true
	log.Println("Successfully connected to RabbitMQ")
	return nil
}

func (receiver *RabbitMQClient) Close() {
	if receiver.channel != nil {
		receiver.channel.Close()
		receiver.channel = nil
	}
	if receiver.connection != nil {
		receiver.connection.Close()
		receiver.connection = nil
	}
	receiver.isConnected = false
}

// Envoi d'un message à la queue RabbitMQ avec reconnexion automatique
func (receiver *RabbitMQClient) SendToQueue(request BillingRequest) error {
	// S'assurer que la connexion est active
	if !receiver.isConnected {
		if err := receiver.connectInternal(); err != nil {
			return err
		}
	}

	body, err := json.Marshal(request)
	if err != nil {
		failOnError(err, "Failed to encode JSON")
		return err
	}

	// Publier le message à la queue
	err = receiver.channel.Publish(
		"", receiver.queue.Name, false, false,
		amqp.Publishing{ContentType: "application/json", Body: body},
	)

	// Si erreur de publication, tenter de se reconnecter et réessayer une fois
	if err != nil {
		log.Printf("Failed to publish message, attempting reconnection: %s", err)
		receiver.isConnected = false

		if err := receiver.connectInternal(); err != nil {
			return err
		}

		// Réessayer la publication après reconnexion
		return receiver.channel.Publish(
			"", receiver.queue.Name, false, false,
			amqp.Publishing{ContentType: "application/json", Body: body},
		)
	}

	return nil
}
