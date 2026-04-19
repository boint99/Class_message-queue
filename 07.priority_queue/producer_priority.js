const connectRabbit = require("../config/rabbit.config");

const producerPriority = async () => {
  // Khởi tạo kết nối đến RabbitMQ và tạo channel
  const connection = await connectRabbit();
  const channel = await connection.createChannel();

  const queueDXL = "priority_queue-v2";

  channel.assertQueue(queueDXL, {
    durable: true,
    arguments: {
      "x-max-priority": 10, // Đặt mức độ ưu tiên tối đa cho hàng đợi
    },
  });

  channel.sendToQueue(queueDXL, Buffer.from("Message with priority 5"), {
    priority: 5, // Đặt mức độ ưu tiên cho tin nhắn
    persistent: true, // Đảm bảo tin nhắn được lưu trữ trên đĩa nếu RabbitMQ khởi động lại
  });
  channel.sendToQueue(queueDXL, Buffer.from("Message with priority 10"), {
    priority: 10, // Đặt mức độ ưu tiên cao hơn cho tin nhắn này
    persistent: true,
  });
  channel.sendToQueue(queueDXL, Buffer.from("Message with priority 1"), {
    priority: 1, // Đặt mức độ ưu tiên thấp hơn cho tin nhắn này
    persistent: true,
  });

  console.log("(x) Sent ticket with priority.");

  // Đóng kết nối sau khi gửi xong
  await channel.close();
  await connection.close();
};

producerPriority().catch(console.error);
