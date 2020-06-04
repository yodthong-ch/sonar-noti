import LogDeviceFailedInterface from './interfaces/LogDeviceFailedInterface'
import DeviceFailedModel from '../models/mongo/service_notification/log_device_failed'

class LogDeviceFailedRepository implements LogDeviceFailedInterface {
    private hdrid?: string
    private program?: string
    private appid?: string
    private chunk?: number
    private userId?: number
    private token?: string
    private error?: string

    static make(): LogDeviceFailedInterface
    {
        return new LogDeviceFailedRepository()
    }

    setHeaderId(id: string): LogDeviceFailedInterface {
        this.hdrid = id
        return this
    }
    setProgram(program: string): LogDeviceFailedInterface {
        this.program = program
        return this
    }
    setAppId(appid: string): LogDeviceFailedInterface {
        this.appid = appid
        return this
    }
    setChunk(chunk: number): LogDeviceFailedInterface {
        this.chunk = chunk
        return this
    }
    setUserId(userId: number): LogDeviceFailedInterface {
        this.userId = userId
        return this
    }
    setDeviceToken(token: string): LogDeviceFailedInterface {
        this.token = token
        return this
    }
    setError(error: string): LogDeviceFailedInterface {
        this.error = error
        return this
    }
    private valid()
    {
        if (!this.hdrid)
        {
            throw new Error(`header id required`)
        }

        if (!this.program)
        {
            throw new Error(`program required`)
        }

        if (!this.appid)
        {
            throw new Error(`app id required`)
        }

        if (!this.token)
        {
            throw new Error(`token required`)
        }
    }
    async save(): Promise<string> {
        this.valid()

        const result = await DeviceFailedModel.create({
            headerId: this.hdrid,
            createAt: new Date(),
            program: this.program,
            appId: this.appid,
            chunk: this.chunk,
            userId: this.userId,
            deviceToken: this.token,
            error: this.error,
        })
        
        return result._id
    }

}

export default LogDeviceFailedRepository