const connectRabbit = require("../config/rabbit.config");

const delaySend = async () => {
  const connection = await connectRabbit();
  const channel = await connection.createChannel();

  // queue delay để nhận message sau khi hết thời gian delay với  routing key "go"
  await channel.sendToQueue(
    "delay_queue_10s",
    Buffer.from("Hello after 10 seconds!"),
    { persistent: true },
  );

  console.log("(*) Delay message sent! ");
  await channel.close();
  await connection.close();
};

delaySend().catch(console.error);
