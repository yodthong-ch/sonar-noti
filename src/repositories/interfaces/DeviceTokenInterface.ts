import Token from "../../items/Token";
import { DeviceType } from "../../config/appid";
interface DeviceTokenInterface {
    register(appVersion: string, deviceType: DeviceType, deviceToken: string, userId?: number):Promise<boolean>
    count(): Promise<number>
    execute():Promise<Token[]>
    chunk(offset: number, limit: number): Promise<Token[]> 
    
    setAppId(value: string):DeviceTokenInterface
    setDeviceType(value: string):DeviceTokenInterface
    setUserIds(userIds: number[]):DeviceTokenInterface
    clearUserIds():DeviceTokenInterface
}

export default DeviceTokenInterface