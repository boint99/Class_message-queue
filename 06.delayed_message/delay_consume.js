const connectRabbit = require("../config/rabbit.config");

const delayConsume = async () => {
  const connection = await connectRabbit();
  const channel = await connection.createChannel();

  //   Khởi tạo exchange, queue và binding cho delayed message
  const queuedelay = "delay_queue";

  // queue delay để nhận message sau khi hết thời gian delay với  routing key "go"
  await channel.assertQueue(queuedelay, { durable: true });

  channel.consume(
    queuedelay,
    (msg) => {
      if (msg !== null) {
        console.log("(*) Received delayed message: ", msg.content.toString());
        channel.ack(msg);
      }
    },
    { noAck: false },
  );
};

delayConsume().catch(console.error);
