const connectRabbit = require("../config/rabbit.config");

const delaySetup = async () => {
  const connection = await connectRabbit();
  const channel = await connection.createChannel();

  //   Khởi tạo exchange, queue và binding cho delayed message
  const queuedelay = "delay_queue";
  const ExchangeDelay = "main_exchange";
  const routingKey = "go";

  await channel.assertExchange(ExchangeDelay, "direct", { durable: true });
  await channel.assertQueue(queuedelay, { durable: true });
  await channel.bindQueue(queuedelay, ExchangeDelay, routingKey);

  // queue delay để nhận message sau khi hết thời gian delay với  routing key "go"
  await channel.assertQueue("delay_queue_10s", {
    durable: true,
    arguments: {
      "x-message-ttl": 10000, // Thời gian delay 10 giây
      "x-dead-letter-exchange": ExchangeDelay, // Exchange để gửi message sau khi hết thời gian delay
      "x-dead-letter-routing-key": routingKey, // Routing key để gửi message sau khi hết thời gian delay
    },
  });

  console.log("(*) Delay setup ready! ");
  await channel.close();
  await connection.close();
};

delaySetup().catch(console.error);
