import {Express} from 'express'
import {key} from '../config/app'
import DecodeMiddleware from '../middlewares/decode'
import postChunk from './chunk'
import DeviceToken from '../repositories/DeviceToken'
import LogHeader from '../repositories/LogHeader'
import createRabbitMQ from '../connectors/rabbitmq'
import LegacyQueue from '../connectors/beanstalk'
import { postHealthCheck } from './health'

export default (app:Express):void => {
    
    const decMiddle = DecodeMiddleware(key!)

    app.post('/chunk', decMiddle, postChunk(
        ()=>DeviceToken.make(),
        ()=> LogHeader.make(),
        async () => await createRabbitMQ(),
        async () => await LegacyQueue('LegacyNotification')
    ))

    app.post('/health', decMiddle, postHealthCheck())

    app.get('/', (_, res) => {
        res.send("Private API Hello")
    })
}