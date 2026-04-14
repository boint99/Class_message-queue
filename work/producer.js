const amqp = require("amqplib");

const producer = async () => {
  const connection = await amqp.connect("amqp://admin:Admin%40123@localhost");
  const channel = await connection.createChannel();

  const queue = "Task_queue";
  await channel.assertQueue(queue, { durable: false });

  for (let i = 0; i <= 10; i++) {
    const message = `Task ${i}`;
    channel.sendToQueue(queue, Buffer.from(message), { persistent: false });
    console.log(`[x] Sent: ${message}`);
  }
  await channel.close();
  await connection.close();
};

producer().catch(console.error);
