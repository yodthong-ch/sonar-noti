import {Request, Response} from 'express'
import {InputDeviceLogFailed} from '../items/type'
import LogDeviceFailedInterface from '../repositories/interfaces/LogDeviceFailedInterface'

export const postLogFailed = (LogDeviceFailedDI: ()=> LogDeviceFailedInterface) =>
    async (req: Request, res: Response) => {
        const data = req.body as InputDeviceLogFailed

        try
        {
            const id = await LogDeviceFailedDI()
                .save({
                    headerId: data.headerId,
                    appId: data.appId,
                    program: data.program,
                    chunk: data.chunk,
                    deviceToken: data.deviceToken,
                    userId: data.userId || 0,
                    error: data.error,
                })

            res.send({ id })
        }
        catch (error) {
            res.status(500).send({error})
        }
    }
export default postLogFailed