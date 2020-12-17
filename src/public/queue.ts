import {Request, Response} from 'express'
import DeviceTokenInterface from '../repositories/interfaces/DeviceTokenInterface'
import {InputQueue, ChunkPacket} from '../items'
import { ClusterRequestFunc } from '../services/Request'
import LogHeaderInterface from '../repositories/interfaces/LogHeaderInterface'
import appIds from '../config/appid'
import { setState } from '../libs/state'
import log from '../libs/log'

const valid = (input: InputQueue) => {
    if (!input)
        throw new Error(`input require`)
    if (!input.program)
        throw new Error(`program require`)

    if (!input.payload)
        throw new Error(`payload require`)
    else if (Object.entries(input.payload).length === 0)
        throw new Error(`payload is empty`)

    if (!input.target.appId)
        throw new Error(`appid require`)
    else if (!appIds[input.target.appId])
        throw new Error(`${input.target.appId} invalid`)
}

export const postQueue = (
        DeviceTokenDI:()=>DeviceTokenInterface,
        LogHeaderDI: ()=> LogHeaderInterface,
        ClusterRequestDI: ()=>ClusterRequestFunc,
        LIMIT_TOKEN:number,
        LIMIT_PRIVATE_CONN:number
    ) =>
    async (req: Request, res: Response) => {
        const data = <InputQueue>req.body
        const clusterRequest = ClusterRequestDI()

        try {
            setState('working_queue', true)
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

            const hdrId = await hdr.save({
                createAt: new Date(),
                program: data.program,
                payload: data.payload,
                tags: data.tags,
                chunks: [],
                target: {
                    appId: data.target.appId,
                    userIds: data.target.userIds,
                    deviceMatch: total,
                },
                options: data.options,
                status: "P",
            })

            res.status(200).send({
                ack: true,
                total,
                id: hdrId,
            })

            log.info(`start: ${hdr.getId()}`)

            log.info(`totalPage: ${totalPage}`)
            let chunkOffsets = []
            for (let i = 0; i < totalPage; i++)
            {
                chunkOffsets.push(i * LIMIT_TOKEN)
            }

            let ccnt = 0
            while (ccnt < totalPage)
            {
                const chunked = chunkOffsets.slice(ccnt, ccnt + LIMIT_PRIVATE_CONN)
                log.info(`run chunk -> ${chunked.toString()}`, {chunked})
                await Promise.all(chunked.map( async c => {

                    const newChunk:ChunkPacket = {
                        headerId: hdr.getId(),
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
            log.info(`done: ${hdr.getId()}`)
            hdr.flagDone()
        }
        catch (err)
        {
            res.status(500).send({error: err.message})
            log.error(err)
        }
        finally
        {
            setState('working_queue', false)
        }

    }
