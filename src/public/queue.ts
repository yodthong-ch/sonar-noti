import {Request, Response} from 'express'
import DeviceTokenInterface from '../repositories/interfaces/DeviceTokenInterface'
import {InputQueue, ChunkPacket} from '../items/type'
import { ClusterRequest } from '../services/Request'
import LogHeaderInterface from '../repositories/interfaces/LogHeaderInterface'

const LIMIT_TOKEN = 5000,
        LIMIT_PRIVATE_CONN = 10

const valid = (input: InputQueue) => {
    if (!input)
        throw new Error(`input require`)
    if (!input.program)
        throw new Error(`program require`)
    if (!input.message)
        throw new Error(`message require`)
    if (!input.target.appId)
        throw new Error(`appid require`)
}

export const postQueue = (DeviceTokenDI:()=>DeviceTokenInterface, LogHeaderDI: ()=> LogHeaderInterface) =>
    async (req: Request, res: Response) => {
        const data = req.body as InputQueue

        try {
            valid(data)
        }
        catch (err)
        {
            res.status(400).send({error: err.message})
            return;
        }

        try {
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
        catch (err)
        {
            res.status(500).send({error: err.message})
        }
        
    }