const connectRabbit = require("../config/rabbit.config");

const setupDLX = async () => {
  // Khởi tạo kết nối đến RabbitMQ và tạo channel
  const connection = await connectRabbit();
  const channel = await connection.createChannel();

  // Tạo exchange và queue cho Dead Letter Exchange (DLX)
  // Ở đây, chúng ta tạo một exchange kiểu "fanout" và một queue để nhận các message bị từ chối
  await channel.assertExchange("dlx_exchange", "fanout", { durable: true });
  await channel.assertQueue("dlx_queue", { durable: true });

  // dlx_queue: Đây là queue sẽ nhận các message bị từ chối từ exchange dlx_exchange
  //   dlx_exchange: Đây là exchange mà chúng ta sẽ sử dụng để gửi các message bị từ chối. Khi một message bị từ chối, nó sẽ được gửi đến exchange này và sau đó được chuyển đến dlx_queue.
  // "": Đây là routing key, nhưng vì chúng ta sử dụng exchange kiểu "fanout", nên routing key sẽ bị bỏ qua và tất cả các message sẽ được gửi đến dlx_queue.
  await channel.bindQueue("dlx_queue", "dlx_exchange", "");

  await channel.assertQueue("main_queue", {
    durable: true,
    arguments: {
      // Cấu hình Dead Letter Exchange cho main_queue
      "x-dead-letter-exchange": "dlx_exchange", // Khi message bị từ chối, nó sẽ được gửi đến exchange này
      "x-dead-letter-ttl": 5000, // Thời gian sống của message trong main_queue trước khi bị từ chối (5 giây)
    },
  });

  //   Gửi một message đến main_queue để kiểm tra
  const message = "Hello, this is a test message!";
  await channel.sendToQueue("main_queue", Buffer.from(message), {
    persistent: true, // Đảm bảo message được lưu trữ trên disk
  });
  console.log(`Sent message to main_queue: ${message}`);

  // Đóng kết nối sau khi gửi xong
  await channel.close();
  await connection.close();
};

setupDLX().catch(console.error);
