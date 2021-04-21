import {Express} from 'express'
import {key} from '../config/app'
import DecodeMiddleware from '../middlewares/decode'
import postChunk from './chunk'
import DeviceToken from '../repositories/DeviceToken'
import LogHeader from '../repositories/LogHeader'
import createRabbitMQ from '../connectors/rabbitmq'
import { postHealthCheck } from './health'

export default (app:Express):void => {
    
    const decMiddle = DecodeMiddleware(key!)

    app.post('/chunk', decMiddle, postChunk(
        ()=>DeviceToken.make(),
        ()=> LogHeader.make(),
        async () => await createRabbitMQ()
    ))

    app.post('/health', decMiddle, postHealthCheck())

    app.get('/', (_, res) => {
        res.send("Private API Hello")
    })
}