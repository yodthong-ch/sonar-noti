import {Request, Response} from 'express'
import DeviceTokenInterface from '../repositories/interfaces/DeviceTokenInterface'
import { ChunkPacket } from '../items/type'
import LogHeaderInterface from '../repositories/interfaces/LogHeaderInterface'
import {connect} from '../connectors/beanstalkd'

export const postChunk = (DeviceTokenDI:()=>DeviceTokenInterface, LogHeaderDI: ()=> LogHeaderInterface) =>
    async (req: Request, res: Response) => {
        const data = <ChunkPacket>JSON.parse(req.body)

        try
        {
            const hdr = await LogHeaderDI().setHeaderId(data.headerId).getHeader()
            if (!hdr)
            {
                res.send({nonehdr: true})
                return;
            }
            const device = DeviceTokenDI()
            device.setAppId(data.target.appId)
            if (data.target.deviceType) device.setDeviceType(data.target.deviceType)
            if (data.target.userId) device.setUserIds(data.target.userId)

            const tokens = await device.chunk(data.offset, data.limit)
            res.send({token: tokens.length})

            tokens.map( async item => {
                if (item.deviceType === 'firebase' || item.deviceType === 'firebase:android' || item.deviceType === 'firebase:ios' || item.deviceType === 'firebase:web')
                {
                    const bt = await connect('FIREBASE_API')

                    bt.put(encodeURIComponent(JSON.stringify({
                        appId: data.target.appId,
                        token: item.token,
                        payload: hdr.message,
                    })))
                }
            })
        }
        catch (err)
        {
            res.send({error: true})
        }
        finally
        {

        }
    }

export default postChunk