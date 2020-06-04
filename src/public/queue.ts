import {Request, Response} from 'express'
import DeviceTokenInterface from '../repositories/interfaces/DeviceTokenInterface'
import {InputQueue, ChunkPacket} from '../items/type'
import { clusterRequest } from '../services/Request'
import LogHeaderInterface from '../repositories/interfaces/LogHeaderInterface'
import appIds from '../config/appid'

const LIMIT_TOKEN = 5000,
        LIMIT_PRIVATE_CONN = 10

const valid = (input: InputQueue) => {
    if (!input)
        throw new Error(`input require`)
    if (!input.program)
        throw new Error(`program require`)
        
    if (!input.message)
        throw new Error(`message require`)
    else if (Object.entries(input.message).length === 0)
        throw new Error(`message is empty`)

    if (!input.target.appId)
        throw new Error(`appid require`)
    else if (!appIds[input.target.appId])
        throw new Error(`${input.target.appId} invalid`)
}

export const postQueue = (DeviceTokenDI:()=>DeviceTokenInterface, LogHeaderDI: ()=> LogHeaderInterface) =>
    async (req: Request, res: Response) => {
        const data = req.body as InputQueue

        try {
            valid(data)

            const token = DeviceTokenDI()
            token.setAppId(data.target.appId)
            
            if (data.target.deviceType)
            {
                token.setDeviceType(data.target.deviceType)
            }

            if (data.target.userIds)
            {
                token.setUserIds(data.target.userIds)
            }

            const total = await token.count()
            const totalPage = Math.ceil(total / LIMIT_TOKEN)

            const hdr = LogHeaderDI()

            const hdrId = await hdr.store({
                createAt: new Date(),
                program: data.program,
                message: data.message,
                chunks: [],
                target: {
                    appId: data.target.appId,
                    userIds: data.target.userIds,
                    deviceMatch: total,
                },
                status: "P",
            })

            res.send({
                ack: true,
                total,
                id: hdrId,
            })

            let chunkOffsets = []
            for (let i = 0; i < totalPage; i++)
            {
                chunkOffsets.push(i * LIMIT_TOKEN)
            }

            let ccnt = 0
            while (ccnt < totalPage)
            {
                const chunked = chunkOffsets.slice(ccnt, ccnt + LIMIT_PRIVATE_CONN)

                await Promise.all(chunked.map( async c => {

                    const newChunk:ChunkPacket = {
                        headerId: hdr.getHeaderId(),
                        target: data.target,
                        offset: c,
                        limit: LIMIT_TOKEN,
                    }
                    try
                    {
                        await clusterRequest('chunk', newChunk)
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
        catch (err)
        {
            res.status(500).send({error: err.message})
        }
        
    }