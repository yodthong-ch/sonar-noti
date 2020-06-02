import {Request, Response} from 'express'
import DeviceTokenInterface from '../repositories/interfaces/DeviceTokenInterface'
import {connect} from '../connectors/beanstalkd'
import {InputQueue, ChunkPacket} from '../items/type'
import { ClusterRequest } from '../services/Request'
import LogHeaderInterface from '../repositories/interfaces/LogHeaderInterface'

const LIMIT_TOKEN = 5000,
        LIMIT_PRIVATE_CONN = 10

export const postQueue = (DeviceTokenDI:()=>DeviceTokenInterface, LogHeaderDI: ()=> LogHeaderInterface) =>
    async (req: Request, res: Response) => {
        const data = req.body as InputQueue

        const token = DeviceTokenDI()
        token.setAppId(data.target.appId)
        if (data.target.deviceType)
        {
            token.setDeviceType(data.target.deviceType)
        }

        if (data.target.userId)
        {
            token.setUserIds(data.target.userId)
        }

        try {
            const total = await token.count()
            const totalPage = Math.ceil(total / LIMIT_TOKEN)

            const hdr = LogHeaderDI()

            const hdrId = await hdr.store({
                createAt: new Date(),
                program: 'notification',
                message: data.message,
                chunks: [],
                target: {
                    appId: data.target.appId,
                    userId: data.target.userId,
                    deviceMatch: total,
                },
                status: "P",
            })

            res.send({
                ack: true,
                total,
                id: hdrId,
            })

            let chunks = []
            for (let i = 0; i < totalPage; i++)
            {
                chunks.push(i * LIMIT_TOKEN)
            }

            let ccnt = 0
            while (ccnt < totalPage)
            {
                const chunked = chunks.slice(ccnt, ccnt + LIMIT_PRIVATE_CONN)

                await Promise.all(chunked.map( async c => {

                    const newChunk:ChunkPacket = {
                        headerId: hdr.getHeaderId(),
                        target: data.target,
                        offset: c,
                        limit: LIMIT_TOKEN,
                    }
                    try
                    {
                        await ClusterRequest('chunk', newChunk)
                        hdr.chunkState(c, true)
                        return true
                    }
                    catch (err)
                    {
                        hdr.chunkState(c, false)
                        return false
                    }
                }))

                ccnt += chunked.length
            }

            hdr.flagDone()
        }
        catch (_err)
        {
            const err = _err as Error

            res.status(500).send(err.message)
        }
        
    }