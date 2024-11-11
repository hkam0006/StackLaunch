import * as amqp from 'amqplib'

export default async function sendToRabbitMQ(queueName: string, message: string){
  await amqp.connect(process.env.CLOUDAMQP_HOST as string, )
  const connection = await amqp.connect(process.env.CLOUDAMQP_HOST as string)

  const channel = await connection.createChannel()
  await channel.assertQueue(
    queueName,
    {durable: true}
  )

  channel.sendToQueue(queueName, Buffer.from(message))
}