import { addOrder } from "../models/billingModel.js";

// Fonction pour traiter les message de facturation
async function processBillingMessage(message) {
    try {
        // Extraire les données du message
        const data = JSON.parse(message.content.toString());
        // Ajouter l'enregistrement dans la base de données
        await addOrder(data.user_id, data.number_of_items, data.total_amount);
    } catch (error) {
        console.log("❌ => Error processing order", error);
    }
}

export {processBillingMessage};