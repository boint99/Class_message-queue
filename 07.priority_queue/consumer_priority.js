const connectRabbit = require("../config/rabbit.config");

const consumerPriority = async () => {
  // Khởi tạo kết nối đến RabbitMQ và tạo channel
  const connection = await connectRabbit();
  const channel = await connection.createChannel();

  const queueDXL = "priority_queue_v2";

  channel.assertQueue(queueDXL, {
    durable: true,
    arguments: {
      "x-max-priority": 10, // Đặt mức độ ưu tiên tối đa cho hàng đợi
    },
  });

  console.log("(x) waiting...");
  channel.consume(queueDXL, (msg) => {
    if (msg !== null) {
      console.log(`[x] Received: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
  console.log("---------------");
};

consumerPriority().catch(console.error);
