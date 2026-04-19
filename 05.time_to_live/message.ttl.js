const connectRabbit = require("../config/rabbit.config");

const messageTTL = async () => {
  const connection = await connectRabbit();
  const channel = await connection.createChannel();

  const queue = "Task_msg_ttl";

  await channel.assertQueue(queue, { durable: true });

  await channel.sendToQueue(queue, Buffer.from("OTP: 123457"), {
    persistent: true,
    expiration: "5000", // TTL: 5 giây
  });

  console.log("(x) Sent OTP with TTL 5s");

  await channel.close();
  await connection.close();
};

messageTTL().catch(console.error);
