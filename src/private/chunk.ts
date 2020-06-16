import {Request, Response} from 'express'
import DeviceTokenInterface from '../repositories/interfaces/DeviceTokenInterface'
import { ChunkPacket } from '../items'
import LogHeaderInterface from '../repositories/interfaces/LogHeaderInterface'

import { DeviceType } from '../config/appid'
import QueueInterface from '../connectors/QueueInterface'
import { setState } from '../libs/state'
import log from '../libs/log'

export const postChunk = (DeviceTokenDI:()=>DeviceTokenInterface, LogHeaderDI: ()=> LogHeaderInterface, QueueDI: (tube:string)=>Promise<QueueInterface>) =>
    async (req: Request, res: Response) => {
        const data = <ChunkPacket>req.body
        try
        {
            setState('working_priv_chunk', true)
            const hdr = await LogHeaderDI().setId(data.headerId).getHeader()
            if (!hdr)
            {
                setState('working_priv_chunk', false)
                res.send({nonehdr: true})
                return;
            }

            const device = DeviceTokenDI()
            device.setAppId(data.target.appId)
            if (data.target.deviceType) device.setDeviceType(data.target.deviceType)
            if (data.target.userIds) device.setUserIds(data.target.userIds)

            const tokens = await device.chunk(data.offset, data.limit)
            res.send({token: tokens.length})

            tokens.map( async item => {
                if (item.deviceType.indexOf(DeviceType.FIREBASE) >= 0)
                {
                    const bt = await QueueDI('FIREBASE_API')
                    bt.put(encodeURIComponent(JSON.stringify({
                        appId: data.target.appId,
                        program: hdr.program,
                        headerId: hdr._id,
                        chunk: data.offset,
                        userId: item.userId || 0,
                        token: item.token,
                        payload: hdr.payload,
                    })))
                }
            })
        }
        catch (err)
        {
            res.send({error: true})
            log.error(err)
        }
        finally
        {
            setState('working_priv_chunk', false)
        }
    }

export default postChunk