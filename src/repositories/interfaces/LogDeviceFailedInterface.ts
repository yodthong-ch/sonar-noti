import LogDeviceFailed from "../../items/LogDeviceFailed";

interface LogDeviceFailedInterface {
    setHeaderId(id: string):LogDeviceFailedInterface
    setProgram(program: string):LogDeviceFailedInterface
    setAppId(appid: string):LogDeviceFailedInterface
    setChunk(no: number):LogDeviceFailedInterface
    setUserId(userId: number):LogDeviceFailedInterface
    setDeviceToken(token: string):LogDeviceFailedInterface
    setError(error: string):LogDeviceFailedInterface
    
    save():Promise<string>
}

export default LogDeviceFailedInterface