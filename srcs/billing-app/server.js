import app from './app/routes/route.js';
// import { initDb } from './app/models/billingModel.js';
import { rabbitMQConsumer } from './app/config/rabbitmq.js';


const port = process.env.BILLING_PORT || 3002;
app.listen(port, () => {
  console.log(`➡️  => Billing API listening at http://localhost:${port}`);
  // Démarrer le consommateur RabbitMQ
  rabbitMQConsumer();
});
