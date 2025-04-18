import 'dotenv/config';
import express from 'express';
import amqp from 'amqplib';
import { processBillingMessage } from '../controllers/billingController.js';


let processedBillings = 0;
let failedBillings = 0;
// Connexion à RabbitMQ et configuration du consumer

export async function rabbitMQConsumer() {
    try {
        const connection = await amqp.connect(process.env.BILLING_RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = process.env.BILLING_QUEUE_NAME;
        await channel.assertQueue(queue, { durable: false });

        // Limiter le nbre de messages traités en même temps
        channel.prefetch(1);

        console.log(`👇 => Waiting for messages in ${queue}. To exit press CTRL+C`);

        // Configration du consommateur
        channel.consume(queue, async (msg) => {
            if (msg) {
                try {
                    console.log(`[x] Received ${msg.content}`);
                    await processBillingMessage(msg);
                    console.log('✅ => Message processed successfully');
                    channel.ack(msg,);
                    processedBillings++;
                } catch (error) {
                    console.error('❌ => Error processing message:');
                    channel.nack(msg + '\n', false, true);
                    failedBillings++;
                }
                console.log(`Processed: ${processedBillings}, Failed: ${failedBillings}`);
            }

        });

    } catch (error) {
        console.error('❌ => Error connecting to RabbitMQ:');
    }
}
export default rabbitMQConsumer;
