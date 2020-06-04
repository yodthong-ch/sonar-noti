import {Express} from 'express'
import {key} from '../config/app'
import DecodeMiddleware from '../middlewares/decode'
import PostChunk from './chunk'
import DeviceToken from '../repositories/DeviceToken'
import LogHeader from '../repositories/LogHeader'

export default (app:Express) => {
    if (!key) {
        throw new Error(`private api: missing key`)
    }
    
    const decmiddle = DecodeMiddleware(key)

    app.post('/chunk', decmiddle, PostChunk(()=>DeviceToken.make(), ()=> LogHeader.make()))

    app.get('/', (_, res) => {
        res.send("Private API Hello")
    })
}