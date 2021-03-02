import amqplib from 'amqplib'
// import QueueInterface, { ChannelInterface, PublishResponse } from './QueueInterface'
import { NotificationCentre } from '@dek-d/notification-core'
import config from '../config/rabbitmq'
import {Message} from '@dek-d/notification-core'

let connections:RabbitMQConnection

class RabbitMQConsumerMessage implements NotificationCentre.ConsumerResultInterface {
    private channel: amqplib.Channel
    private msg: amqplib.ConsumeMessage
    constructor(channel: amqplib.Channel, msg: amqplib.ConsumeMessage)
    {
        this.channel = channel
        this.msg = msg
    }
    getMessage():Buffer {
        return this.msg.content
    }
    ack():void {
        this.channel.ack(this.msg, true)
    }
    nack():void {
        this.channel.nack(this.msg)
    }
}

class RabbitMQConsume implements NotificationCentre.ConsumeInterface {
    private channel: amqplib.Channel
    private queue: NotificationCentre.QueueType

    constructor(channel: amqplib.Channel, queue: NotificationCentre.QueueType)
    {
        this.channel = channel
        this.queue = queue
    }
    async watch(callback: (msg:NotificationCentre.ConsumerResultInterface) => void): Promise<void> {
        await this.channel.consume(this.queue.name, (msg) => {
            if (msg)
            {
                callback(new RabbitMQConsumerMessage(this.channel, msg))
            }
        })
    }
}

export class RabbitMQChannel implements NotificationCentre.ChannelInterface {
    private channel: amqplib.Channel
    private service: NotificationCentre.ServiceType

    constructor(channel: amqplib.Channel, service: NotificationCentre.ServiceType)
    { 
        this.channel = channel
        this.service = service
    }
    async consume(queue: string): Promise<NotificationCentre.ConsumeInterface> {
        if (!this.service.queues[queue])
            throw new Error(`not found queue ${queue}`)
        const queueSvc = this.service.queues[queue]

        if (queueSvc.routingKeys)
        {
            const prom = queueSvc.routingKeys.map( async (routing) => {
                return await this.channel.bindQueue(queueSvc.name, this.service.exchange.name, routing)
            })
            await Promise.all(prom)
        }
        return new RabbitMQConsume(this.channel, this.service.queues[queue])
    }

    async close():Promise<void> {
        await this.channel.close()
    }

    async publish(queueTarget: string, payload: Message.MessageQueue, options?: Message.InputQueueOptions): Promise<NotificationCentre.PublishResponse> {
        const response = await this.bulkPublish(queueTarget, [payload], options)
        return response[0]
    }

    async bulkPublish(queueTarget: string, payloads: Message.MessageQueue[], options?: Message.InputQueueOptions): Promise<NotificationCentre.PublishResponse[]> {
        const opts:amqplib.Options.Publish = {}
        if (options)
        {
            opts.headers = {}
            if (options.delay)
            {
                opts.headers['x-delay'] = options.delay * 1000
            }
        }

        return Promise.all(payloads.map( async (payload) => {
            const result:NotificationCentre.PublishResponse = {status: false}

            try
            {
                result.status = this.channel.publish(
                    this.service.exchange.name,
                    queueTarget,
                    Buffer.from(JSON.stringify(payload)),
                    opts
                )

                return result
            }
            catch (error) {
                result.status = false
                result.error = error
                return result
            }
        }))
    }
    
}

export class RabbitMQConnection implements NotificationCentre.QueueInterface {
    private ready = false
    private conn:amqplib.Connection | undefined
    private connectionInfo:amqplib.Options.Connect

    constructor(connectionInfo: amqplib.Options.Connect)
    {
        this.connectionInfo = connectionInfo
    }

    async createChannel(service: NotificationCentre.ServiceType): Promise<NotificationCentre.ChannelInterface> {
       
        if (!this.ready)
            throw new Error(`api not ready`)

        const chan = await this.conn?.createChannel()
        if (!chan) 
            throw new Error('can\'t create channel')

        await chan.assertExchange(service.exchange.name, service.exchange.type, service.exchange.options || {durable: true})

        return new RabbitMQChannel(chan, service)
    }

    async connect(): Promise<boolean> {
        if (this.ready) return true

        if (!this.connectionInfo)
            throw new Error('config is blank')

        this.conn = await amqplib.connect(this.connectionInfo)

        this.ready = true
        return true
    }
}

export default async ():Promise<RabbitMQConnection> => {
    if (!connections)
    {
        const conn = new RabbitMQConnection(config)  
        await conn.connect()

        connections = conn
    }

    return connections
}