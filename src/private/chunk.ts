import {Request, Response} from 'express'
import DeviceTokenInterface from '../repositories/interfaces/DeviceTokenInterface'
import { ChunkPacket, Token } from '../items'
import LogHeaderInterface from '../repositories/interfaces/LogHeaderInterface'

import { DeviceType } from '../config/appid'
import QueueInterface from '../connectors/QueueInterface'
import { setState } from '../libs/state'
import log from '../libs/log'

type TokenSet = {[type: string]: Token[]}

export const postChunk = (DeviceTokenDI:()=>DeviceTokenInterface, LogHeaderDI: ()=> LogHeaderInterface, QueueDI: (tube:string)=>Promise<QueueInterface>) =>
    async (req: Request, res: Response) => {
        const data = <ChunkPacket>req.body
        let isSend:boolean = false
        try
        {
            setState('working_priv_chunk', true)
            const hdr = await LogHeaderDI().setId(data.headerId).getHeader()
            if (!hdr)
            {
                setState('working_priv_chunk', false)
                res.send({nonehdr: true})
                isSend = true
                return;
            }

            const device = DeviceTokenDI()
            device.setAppId(data.target.appId)
            if (data.target.deviceType) device.setDeviceType(data.target.deviceType)
            if (data.target.userIds) device.setUserIds(data.target.userIds)

            const tokens = await device.chunk(data.offset, data.limit)
            res.send({token: tokens.length})
            isSend = true

            const payloadMain:{[key: string]: any} = {
                appId: data.target.appId,
                program: hdr.program,
                headerId: hdr._id,
                chunk: data.offset,
                payload: hdr.payload,
            }

            const groupDeviceType = tokens.reduce<TokenSet>((carry, item) => {
                const carryToken = carry[item.deviceType] || []
                return {
                    ...carry,
                    [item.deviceType]: [
                        ...carryToken,
                        item,
                    ],
                }
            }, {})

            for (const dtype of Object.keys(groupDeviceType))
            {
                const tokens = groupDeviceType[dtype]
                const tokenMapUserId = tokens.map(item => ({
                    [item.token]: item.userId || 0
                }))

                if (dtype.indexOf(DeviceType.FIREBASE) >= 0)
                {
                    const bt = await QueueDI('FIREBASE_API')
                    const payloadWithToken = {
                        ...payloadMain,
                        tokens: tokenMapUserId,
                    }
                    bt.put(encodeURIComponent(JSON.stringify(payloadWithToken)))
                }
            }

            /*let ccnt = 0
            const limitChunkToken = 100
            while (ccnt < tokens.length)
            {
                const chunked = tokens.slice(ccnt, ccnt + limitChunkToken)
                for (const item of chunked)
                {
                    if (item.deviceType.indexOf(DeviceType.FIREBASE) >= 0)
                    {
                        const bt = await QueueDI('FIREBASE_API')
                        const payloadWithToken = {
                            ...payloadMain,
                            userId: item.userId || 0,
                            token: item.token,
                        }
                        bt.put(encodeURIComponent(JSON.stringify(payloadWithToken)))
                    }
                }

                ccnt += chunked.length
            }*/
        }
        catch (err)
        {
            if (!isSend)
            {
                res.send({error: err.message})
            }
            log.error(err)
        }
        finally
        {
            setState('working_priv_chunk', false)
        }
    }

export default postChunk