const amqp = require('amqplib')

const receiveMessage = async () => {
    const queue = "Hello"

    const connection = await amqp.connect("amqp://admin:Admin@123@localhost")
    const channel = await connection.createChannel()

    await channel.assertQueue(queue, { durable: false })

    console.log(`[*] Waiting for messages: ${queue}`)

    channel.consume(queue, (msg) => {
        console.log(`(x) received: ${msg.content.toString()}`)
    }, { noAck: true})
}

receiveMessage().catch(console.error)