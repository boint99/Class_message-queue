const amqplib = require("amqplib");
require("dotenv").config();

const connectRabbit = async () => {
  try {
    const url = process.env.RABBITMQ_DEFAULT_URI;
    const conn = await amqplib.connect(url);
    console.log("✅ Connected RabbitMQ");
    return conn;
  } catch (err) {
    console.error("❌ RabbitMQ connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectRabbit;
