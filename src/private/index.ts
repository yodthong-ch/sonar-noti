import {Express} from 'express'
import {Key} from '../config/app'
import DecodeMiddleware from '../middlewares/decode'
import PostChunk from './chunk'
import DeviceToken from '../repositories/DeviceToken'
import LogHeader from '../repositories/LogHeader'

export default (app:Express) => {
    if (!Key) {
        throw new Error(`private api: missing key`)
    }
    
    const decmiddle = DecodeMiddleware(Key)

    app.post('/chunk', decmiddle, PostChunk(()=>DeviceToken.make(), ()=> LogHeader.make()))

    app.get('/', (_, res) => {
        res.send("Private API Hello")
    })
}