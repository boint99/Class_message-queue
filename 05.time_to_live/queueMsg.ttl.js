const connectRabbit = require("../config/rabbit.config");

const queueMsgTTL = async () => {
  const connection = await connectRabbit();
  const channel = await connection.createChannel();
  const queue = "Task_queue_ttl";

  await channel.assertQueue(queue, {
    durable: true,
    arguments: { "x-message-ttl": 10000 }, //10s
  });

  channel.sendToQueue(
    // Gửi tin nhắn với TTL 10 giây
    queue,
    // Tin nhắn sẽ bị xóa sau 10 giây nếu không được tiêu thụ
    Buffer.from("OTP: 123456"),
    { persistent: true },
  );

  console.log("(x) Sent: OTP: 123456 with TTL of 10 seconds");

  await channel.close();
  await connection.close();
};
queueTTL().catch(console.error);
