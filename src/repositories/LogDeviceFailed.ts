import LogDeviceFailedInterface from './interfaces/LogDeviceFailedInterface'
import DeviceFailedModel from '../models/mongo/service_notification/log_device_failed'
import {InputLogDeviceFailed} from '../items'
import appIds from '../config/appid'

class LogDeviceFailedRepository implements LogDeviceFailedInterface {
    static make(): LogDeviceFailedInterface
    {
        return new LogDeviceFailedRepository()
    }

    private valid(input: InputLogDeviceFailed)
    {
        if (!input.headerId)
        {
            throw new Error(`header id required`)
        }

        if (!input.program)
        {
            throw new Error(`program required`)
        }

        if (!input.appId)
        {
            throw new Error(`app id required`)
        }
        else if (!appIds[input.appId])
        {
            throw new Error(`${input.appId} not configured`)
        }

        if (!input.deviceToken)
        {
            throw new Error(`token required`)
        }
    }
    async save(input: InputLogDeviceFailed): Promise<string> {
        this.valid(input)

        const result = await DeviceFailedModel.create({
            headerId: input.headerId,
            createAt: new Date(),
            program: input.program,
            appId: input.appId,
            chunk: input.chunk,
            userId: input.userId,
            deviceToken: input.deviceToken,
            error: input.error,
        })
        
        return result._id
    }

}

export default LogDeviceFailedRepository