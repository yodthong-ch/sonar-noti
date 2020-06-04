import DeviceTokenInterface from "../repositories/interfaces/DeviceTokenInterface"
import {Request, Response} from 'express'
import { InputRegisterToken } from "../items/type"

export const postRegisterToken = (DeviceTokenDI:()=>DeviceTokenInterface) =>
    async (req: Request, res: Response) => {
        const data = req.body as InputRegisterToken
        if (!data.appId || !data.deviceToken || !data.deviceType || !data.version)
        {
            res.status(400).send({require: true})
            return;
        }
        const ok = await DeviceTokenDI()
            .setAppId(data.appId)
            .register(data.version, data.deviceType, data.deviceToken, data.userId)
        res.send({status: ok})
    }