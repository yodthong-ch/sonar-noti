import {Request, Response} from 'express'
import {InputDeviceLogFailed} from '../items/type'
import LogDeviceFailedInterface from '../repositories/interfaces/LogDeviceFailedInterface'

export const postLogFailed = (LogDeviceFailedDI: ()=> LogDeviceFailedInterface) =>
    async (req: Request, res: Response) => {
        const data = req.body as InputDeviceLogFailed

        try
        {
            const id = await LogDeviceFailedDI()
                .setAppId(data.appId)
                .setHeaderId(data.headerId)
                .setProgram(data.program)
                .setChunk(data.chunk)
                .setDeviceToken(data.deviceToken)
                .setUserId(data.userId)
                .setError(data.error)
                .save()

            res.send({ id })
        }
        catch (error) {
            res.status(500).send({error})
        }
    }
export default postLogFailed