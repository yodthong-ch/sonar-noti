import amqplib from 'amqplib'
import {NotificationCentre} from '@dek-d/notification-core'
import { DeviceType } from './appid'

const config: amqplib.Options.Connect = {
    protocol: process.env.DEKD_RABBITMQ_PROTOCAL || 'amqp',
    hostname: process.env.DEKD_RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.DEKD_RABBITMQ_PORT || '5672'),
    vhost: process.env.APP_RABBITMQ_VHOST || '/default',
    username: process.env.APP_RABBITMQ_USERNAME,
    password: process.env.APP_RABBITMQ_PASSWORD,
}

const defaultOptions:{[x: string]: amqplib.Options.AssertExchange} = {
    exchangeOptions: {
        durable: true,
    },
    queueOptions: {
        durable: true,
    },
}

export const vhostMap:{[vhost: string]: string} = {
    notification: '/notification',
    default: '/default',
}

export const services:NotificationCentre.ServiceGroup = {
    notification: {
        exchange: {
            name: 'notification.centre',
            type: 'topic',
            options: {...defaultOptions.exchangeOptions},
        },
        queues: {
            firebase: {
                name: 'notification.centre.firebase'
            }
        },
    },
    notificationDelay: {
        exchange: {
            name: 'notification.delay',
            type: 'topic',
            options: {
                ...defaultOptions.exchangeOptions,
                arguments: {
                    'x-delayed-type': 'topic',
                },
            },
        },
        queues: {
            firebase: {
                name: 'notification.centre.firebase'
            }
        },
    }
}

export const mapQueueByDevice:{[x:string]: string} = {
    [DeviceType.FIREBASE]: 'notification.centre.firebase',
    [DeviceType.FIREBASE_ANDROID]: 'notification.centre.firebase',
    [DeviceType.FIREBASE_IOS]: 'notification.centre.firebase',
    [DeviceType.FIREBASE_WEB]: 'notification.centre.firebase',
}

console.log("CONFIG", config)
export default config