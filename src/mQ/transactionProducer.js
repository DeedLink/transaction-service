import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE = "transaction_events";

export const publishTransaction = async (transaction) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(transaction)), {
      persistent: true,
    });

    console.log("Transaction event sent:", transaction);

    await channel.close();
    await connection.close();
  } catch (err) {
    console.error("Failed to send transaction event:", err);
  }
};
