import DeviceTokenInterface from "../../src/repositories/interfaces/DeviceTokenInterface"
import { DeviceType } from "../../src/config/appid"
import TokenItem from "../../src/items/Token"

const sampleData:TokenItem[] = []

export class MockDeviceToken implements DeviceTokenInterface
{
    public appId: string = ''
    public data:{[x: string]: any} = {}

    async register(appVersion: string, deviceType: DeviceType, deviceToken: string, userId?: number | undefined): Promise<boolean> {
        this.data = {
            appVersion,
            deviceType,
            deviceToken,
            userId,
        }

        return true
    }

    count(): Promise<number> {
        throw new Error("Method not implemented.")
    }
    execute(): Promise<TokenItem[]> {
        throw new Error("Method not implemented.")
    }
    chunk(offset: number, limit: number): Promise<TokenItem[]> {
        throw new Error("Method not implemented.")
    }
    setAppId(value: string): DeviceTokenInterface {
        this.appId = value
        return this
    }
    setDeviceType(value: string): DeviceTokenInterface {
        throw new Error("Method not implemented.")
    }
    setUserIds(userIds: number[]): DeviceTokenInterface {
        throw new Error("Method not implemented.")
    }
    clearUserIds(): DeviceTokenInterface {
        throw new Error("Method not implemented.")
    }
    
}