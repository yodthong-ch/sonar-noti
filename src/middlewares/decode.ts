import * as Express from 'express'
import {AES} from '../helpers/crypt'
import { InputPrivateParams } from '../items'
export type DecodeMiddleware = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => void
export default (key: string):DecodeMiddleware => (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    if (req.method !== 'POST')
    {
        res.status(405).send({
            methodDisallow: true,
        })
        return
    }

    const raw = <string>req.body
    
    if (!raw)
    {
        res.status(400).send({
            badRequest: true,
        })
        return
    }

    try
    {
        const decData = <InputPrivateParams>JSON.parse(AES.decrypt(raw, key))
        req.body =  decData.params
        next()
    }
    catch (err) {
        res.status(500).send({
            invalidCipher: true,
            err
        })
    }
}