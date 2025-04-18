import pool from "../config/database.js";

async function getAllOrders(){
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM orders");
        console.log("✅ => Orders fetched successfully");
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error("❌ => Error fetching orders", error);
    }finally{
        client.release();
    }
}

// Ajouter un enregistrement dans la base de données
async function addOrder(userId, numberOfItems, totalAmount){
    const client = await pool.connect();
    try {
        await client.query(
            "INSERT INTO orders (user_id, numbers_of_items, total_amount) VALUES ($1, $2, $3)",
            [userId, numberOfItems, totalAmount]
        );
        console.log("✅ => Order added successfully");
    } catch (error) {
        console.error("❌ => Error adding order", error);
    }finally{
        client.release();
    }
}

export  {
    getAllOrders,
    addOrder
};