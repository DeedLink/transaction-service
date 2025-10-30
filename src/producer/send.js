import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE = process.env.QUEUE_NAME;

async function publishMessage() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });

    const msg = { id: Date.now(), text: "Hello from producer!" };
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)));

    console.log("Sent:", msg);

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (err) {
    console.error("Publish error:", err);
  }
}

publishMessage();
