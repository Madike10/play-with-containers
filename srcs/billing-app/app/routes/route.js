
import express from 'express';
import { getAllOrders } from '../models/billingModel.js';

const app = express();

app.get('/billing', async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.json(orders); // Send the response back to the client
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

export default app;