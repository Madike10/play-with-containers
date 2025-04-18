package utils

import "os"
type Config struct {
	Port            string
	InventoryAPIURL string
	RabbitMQURL     string
	QueueName       string
}

// LoadConfig loads configuration from .env file or environment variables
func LoadConfig() Config {
	return Config{
		Port:            os.Getenv("API_GATEWAY_PORT", ),
		InventoryAPIURL: os.Getenv("INVENTORY_API_URL"),
		RabbitMQURL:     os.Getenv("RABBITMQ_URL"),
		QueueName:       os.Getenv("QUEUE_NAME"),
	}
}
