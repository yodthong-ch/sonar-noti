import {Request, Response} from 'express'
import DeviceTokenInterface from '../repositories/interfaces/DeviceTokenInterface'
import { LogHeader, Token } from '../items'
import { Message } from '@dek-d/notification-core'
import LogHeaderInterface from '../repositories/interfaces/LogHeaderInterface'

import {mapQueueByDevice, services} from '../config/rabbitmq'
import {NotificationCentre} from '@dek-d/notification-core'
import { setState } from '../libs/state'
import log from '../libs/log'

import _ from 'lodash'
import QueueInterfaceLegacy from '../connectors/QueueInterface'

type TokenSet = {[type: string]: Token[]}

export const postChunk = (
    DeviceTokenDI:()=>DeviceTokenInterface,
    LogHeaderDI: ()=> LogHeaderInterface,
    QueueDI: ()=>Promise<NotificationCentre.QueueInterface>,
    LegacyQueueDI: ()=>Promise<QueueInterfaceLegacy>
) =>
    async (req: Request, res: Response):Promise<void> => {
        const data = <Message.ChunkPacket>req.body
        let isSend = false

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

            const payloadMain:Message.MessageQueue = {
                appId: data.target.appId,
                program: hdr.program,
                headerId: hdr._id!,
                chunk: data.offset,
                payload: hdr.payload,
                tokens: {},
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

            if (hdr.options && hdr.options.delay)
            {
                legacyNotification(
                    LegacyQueueDI,
                    hdr,
                    payloadMain,
                    groupDeviceType
                )
                return;
            }

            const rmq = await QueueDI()
            const channel:NotificationCentre.ChannelInterface = await rmq.createChannel(services['notification'])

            for (const dtype of Object.keys(groupDeviceType))
            {
                const targetRouting = mapQueueByDevice[dtype],
                    routingKey = [targetRouting, hdr.program].join('.')

                const tokens = _.chunk(groupDeviceType[dtype], 200)

                const messages = tokens.map<Message.MessageQueue>( chunkTokens => {
                    const tokenMapUserIds = chunkTokens.reduce<{[token: string]: number}>( (carry, token) => {
                        return {
                            ...carry,
                            [token.token]: token.userId || 0,
                        }
                    }, {})

                    return {
                        ...payloadMain,
                        tokens: tokenMapUserIds,
                    }
                })
                
                await channel.bulkPublish(routingKey, messages)
            }
            await channel.close()
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

const legacyNotification =  async (
    LegacyQueueDI: ()=>Promise<QueueInterfaceLegacy>,
    hdr: LogHeader,
    payload: Message.MessageQueue,
    tokensData: TokenSet
) => {
    const tube = await LegacyQueueDI()

    for (const dtype of Object.keys(tokensData))
    {
        const tokens = _.chunk(tokensData[dtype], 200)

        tokens.map( chunkTokens => {
            const tokenMapUserIds = chunkTokens.reduce<{[token: string]: number}>( (carry, token) => {
                return {
                    ...carry,
                    [token.token]: token.userId || 0,
                }
            }, {})

            tube.put(encodeURIComponent(JSON.stringify({
                ...payload,
                tokens: tokenMapUserIds,
            })), hdr.options)

        })

        
    }

}
export default postChunk
