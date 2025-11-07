import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE = "transaction_events";

/**
 * Publish a transaction event
 * @param {Object} transaction - transaction data
 * @param {string} eventType - type of the event, e.g:"transaction_created"
 */
export const publishTransaction = async (transaction, eventType) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    const message = {
      eventType,
      transaction,
      timestamp: new Date(),
    };

    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log("Transaction event sent:", message);

    await channel.close();
    await connection.close();
  } catch (err) {
    console.error("Failed to send transaction event:", err);
  }
};
