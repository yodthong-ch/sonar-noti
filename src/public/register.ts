import DeviceTokenInterface from "../repositories/interfaces/DeviceTokenInterface"
import {Request, Response} from 'express'
import { InputRegisterToken } from "../items/type"
import { convertDeviceType2Enum } from "../config/appid"

export const postRegisterToken = (DeviceTokenDI:()=>DeviceTokenInterface) =>
    async (req: Request, res: Response) => {
        const data = req.body as InputRegisterToken
        
        if (!data.appId || !data.deviceToken || !data.deviceType || !data.version)
        {
            res.status(400).send({require: true})
            return;
        }

        try
        {
            const ok = await DeviceTokenDI()
                .setAppId(data.appId)
                .register(data.version, convertDeviceType2Enum(data.deviceType), data.deviceToken, data.userId)
            res.status(200).send({status: ok})
        }
        catch (err)
        {
            res.status(500).send({error: err.message})
        }
    }