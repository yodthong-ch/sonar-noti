import {Express} from 'express'
import {key} from '../config/app'
import DecodeMiddleware from '../middlewares/decode'
import PostChunk from './chunk'
import DeviceToken from '../repositories/DeviceToken'
import LogHeader from '../repositories/LogHeader'
import {create as createBT} from '../connectors/beanstalkd'
import { postHealthCheck } from './health'

export default (app:Express) => {
    
    const decMiddle = DecodeMiddleware(key!)

    app.post('/chunk', decMiddle, PostChunk(
        ()=>DeviceToken.make(),
        ()=> LogHeader.make(),
        async (tube: string) => createBT(tube)
    ))

    app.post('/health', decMiddle, postHealthCheck())

    app.get('/', (_, res) => {
        res.send("Private API Hello")
    })
}