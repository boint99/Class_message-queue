const connectRabbit = require("../config/rabbit.config");

// exchange: là nơi nhận tin nhắn và phân phối đến các queue dựa trên routing key
// queue: là routing key, ở đây sử dụng tên queue làm routing key để gửi tin nhắn đến đúng queue đã được liên kết với exchange
const receive = async (exchange, queue) => {
  if (!queue) {
    console.error("Queue name is required");
    return;
  }

  // Khởi tạo kết nối đến RabbitMQ và tạo channel
  const connection = await connectRabbit();
  //   Tạo channel để thực hiện các thao tác với RabbitMQ

  // 1. Tạo exchange nếu chưa tồn tại
  const channel = await connection.createChannel();

  // Đảm bảo rằng exchange đã tồn tại, nếu chưa thì tạo mới. Ở đây sử dụng kiểu exchange là "direct" và đặt durable: true để đảm bảo rằng exchange sẽ tồn tại ngay cả khi RabbitMQ khởi động lại
  await channel.assertExchange(exchange, "direct", { durable: true });
  // Đảm bảo rằng queue đã tồn tại, nếu chưa thì tạo mới. Đặt durable: true để đảm bảo rằng queue sẽ tồn tại ngay cả khi RabbitMQ khởi động lại
  const q = await channel.assertQueue(queue, { durable: true });
  // Liên kết queue với exchange bằng routing key (ở đây sử dụng tên queue làm routing key)
  const bind = await channel.bindQueue(queue, exchange, queue);

  // Đăng ký một consumer để nhận tin nhắn từ queue. Khi có tin nhắn mới, callback function sẽ được gọi với đối số là tin nhắn (msg). Trong callback, chúng ta kiểm tra nếu msg không null, sau đó log nội dung tin nhắn và gửi ACK để xác nhận đã nhận được tin nhắn
  channel.consume(
    q.queue,
    (msg) => {
      if (msg !== null) {
        console.log(
          `Received message from queue ${queue}: ${msg.content.toString()}`,
        );
        channel.ack(msg);
      }
    },
    { noAck: false },
  );
};

// noAck: true có nghĩa là khi một tin nhắn được gửi đến consumer, RabbitMQ sẽ tự động đánh dấu tin nhắn đó là đã được xử lý (acknowledged) ngay khi nó được gửi đi, mà không cần chờ consumer gửi ACK. Điều này có thể dẫn đến mất tin nhắn nếu consumer gặp sự cố trước khi xử lý xong tin nhắn. Ngược lại, noAck: false yêu cầu consumer phải gửi ACK sau khi đã xử lý xong tin nhắn, giúp đảm bảo rằng tin nhắn sẽ không bị mất nếu consumer gặp sự cố.

// Gọi hàm receive để nhận message
receive("messages", "send_nv1");
