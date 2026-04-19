const connectRabbit = require("../config/rabbit.config");

const worker = async () => {
  // Khởi tạo kết nối đến RabbitMQ và tạo channel
  const connection = await connectRabbit();
  const channel = await connection.createChannel();

  const queue = "Task_queue";

  await channel.assertQueue(queue, { durable: true });

  // Đảm bảo rằng mỗi worker chỉ nhận một tin nhắn tại một thời điểm
  channel.prefetch(1);

  console.log("(*) Waiting for task...");

  channel.consume(
    queue,
    async (msg) => {
      if (!msg) return;
      const task = msg.content.toString();
      console.log(`(x) received: ${task}`);
      // Xử lý công việc (giả lập bằng setTimeout (2 giây))
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`(v) done: ${task}`);
      channel.ack(msg);
    },
    { noAck: false },
  );
};

worker().catch(console.error);
