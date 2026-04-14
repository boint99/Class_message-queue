const amqp = require("amqplib");

const worker = async () => {
  const connection = await amqp.connect("amqp://admin:Admin%40123@localhost");
  const channel = await connection.createChannel();

  const queue = "Task_queue";
  await channel.assertQueue(queue, { durable: false });

  channel.prefetch(1);

  console.log("(*) Waiting for task...");
  channel.consume(
    queue,
    async (msg) => {
      if (!msg) return;
      const task = msg.content.toString();
      console.log(`(x) received: ${task}`);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`(v) done: ${task}`);
      channel.ack(msg);
    },
    { noAck: false },
  );
};

worker().catch(console.error);
