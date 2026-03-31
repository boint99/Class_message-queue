const amqp = require('amqplib')

const sendMessage = async () => {
    const queue = "Hello"
    const message = "Hello class 1"

    const connection = await amqp.connect("amqp://admin:Admin@123@localhost")
    const channel = await connection.createChannel()

    await channel.assertQueue(queue, { durable: false })
    channel.sendToQueue(queue, Buffer.from(message))

    console.log(`[x] Sent: ${message}`)

    await channel.close()
    await connection.close()
}

sendMessage().catch(console.error)