const connectRabbit = require("../config/rabbit.config");

// queue: là routing key, ở đây sử dụng tên queue làm routing key để gửi tin nhắn đến đúng queue đã được liên kết với exchange
// exchange: là nơi nhận tin nhắn và phân phối đến các queue dựa trên routing key
// msg: là nội dung tin nhắn mà chúng ta muốn gửi
const send = async (exchange, queue, msg) => {
  // Khởi tạo kết nối đến RabbitMQ và tạo channel
  const connection = await connectRabbit();
  //   Tạo channel để thực hiện các thao tác với RabbitMQ

  const channel = await connection.createChannel();

  // 1. Tạo exchange nếu chưa tồn tại
  await channel.assertExchange(exchange, "direct", { durable: true });

  //   Đảm bảo rằng exchange đã tồn tại, nếu chưa thì tạo mới. Ở đây sử dụng kiểu exchange là "direct" và đặt durable: true để đảm bảo rằng exchange sẽ tồn tại ngay cả khi RabbitMQ khởi động lại
  await channel.assertQueue(exchange, "direct", { durable: true });

  // Buffer.from(msg): chuyển đổi msg thành dạng nhịn phân Buffer để gửi qua RabbitMQ
  channel.publish(exchange, queue, Buffer.from(msg));

  //   log tin nhắn đã gửi thành công
  console.log(`Message sent to queue ${queue}: ${msg}`);

  // Thực hiện send xong thì đóng kết nối channel và connection
  await channel.close();
  await connection.close();
};

// Gọi hàm send để gửi message
send("messages", "send_nv1", "hello nv01");
