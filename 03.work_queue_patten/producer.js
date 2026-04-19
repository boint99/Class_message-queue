const connectRabbit = require("../config/rabbit.config");

const producer = async () => {
  // Khởi tạo kết nối đến RabbitMQ và tạo channel
  const connection = await connectRabbit();
  const channel = await connection.createChannel();

  // Đảm bảo rằng hàng đợi tồn tại trước khi gửi tin nhắn
  const queue = "Task_queue";
  await channel.assertQueue(queue, { durable: true });

  // Gửi nhiều tin nhắn vào hàng đợi
  for (let i = 0; i <= 10; i++) {
    const message = `Task ${i}`;
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true }); // Tin nhắn sẽ được đánh dấu là "persistent" để đảm bảo nó không bị mất nếu RabbitMQ khởi động lại
    console.log(`[x] Sent: ${message}`);
  }

  // Đóng kết nối sau khi gửi xong
  await channel.close();
  await connection.close();
};

producer().catch(console.error);
