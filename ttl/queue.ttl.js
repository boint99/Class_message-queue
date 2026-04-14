const amqp = require("amqplib");

const queueTTL = async () => {
  const connection = await amqp.connect("amqp://admin:Admin%40123@localhost");
  const channel = await connection.createChannel();
  const queue = "Task_queue_ttl_v2";

  await channel.assertQueue(queue, {
    durable: true,
    arguments: { "x-message-ttl": 10000 }, //10s
  });

  channel.sendToQueue(queue, Buffer.from("OTP: 123456"), { persistent: true });

  console.log("(x) Sent: OTP: 123456 with TTL of 10 seconds");

  await channel.close();
  await connection.close();
};
queueTTL().catch(console.error);
