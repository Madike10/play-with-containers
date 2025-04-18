package main

import (
	"api-gateway/utils"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func main() {
	config := utils.LoadConfig()
	log.Println("config", config)

	rabbitMQClient := utils.NewRabbitMQClient()
	if err := rabbitMQClient.Connect(config); err != nil {
		log.Fatal("Erreur de connexion à RabbitMQ:", err)
	}
	defer rabbitMQClient.Close()

	router := mux.NewRouter()

	router.PathPrefix("/api/movies").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		utils.ProxyRequest(w, r, config.InventoryAPIURL)
	})

	router.HandleFunc("/api/billing", func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Erreur de lecture du body", http.StatusInternalServerError)
			return
		}

		var billingRequest utils.BillingRequest
		if err := json.Unmarshal(body, &billingRequest); err != nil {
			http.Error(w, "Format JSON invalide", http.StatusBadRequest)
			return
		}
		if _, err := strconv.Atoi(billingRequest.NumberOfItems); err != nil {
			http.Error(w, "Le nombre d'articles doit être un entier", http.StatusBadRequest)
			return
		}
		if _, err := strconv.Atoi(billingRequest.TotalAmount); err != nil {
			http.Error(w, "Le total amount doit etre un entier", http.StatusBadRequest)
			return
		}

		if err := rabbitMQClient.SendToQueue(billingRequest); err != nil {
			log.Println("billingRequest", billingRequest)
			log.Println("Erreur d'envoi à RabbitMQ:", err)

			http.Error(w, "Erreur d'envoi à RabbitMQ", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(map[string]string{"status": "ok"}); err != nil {
			http.Error(w, "Erreur d'encodage JSON", http.StatusInternalServerError)
			return
		}
	})

	log.Printf("API Gateway démarré sur le port %s", config.Port)
	log.Fatal(http.ListenAndServe(":"+config.Port, router))
}
