import { expect } from 'chai'
import sinon from 'sinon'
import {mockRequest, mockResponse} from 'mock-req-res'
import { postRegisterToken } from '../../src/public/register'
import DeviceTokenInterface from '../../src/repositories/interfaces/DeviceTokenInterface'
import {Request, Response} from 'express'

import {DeviceType} from "../../src/config/appid"
import TokenItem from "../../src/items/Token"

class MockDeviceToken implements DeviceTokenInterface
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

describe('endpoint - public register', () => {
    it('register token', async () => {
        const payload = {
            appId: "com.dekd.apps.admission",
            deviceToken: "1234567890",
            deviceType: "firebase:android",
            version: "2.2.2",
        }

        const mReq = mockRequest({method: "POST", body: payload}),
            mRes = mockResponse()

        const mock = new MockDeviceToken()
        
        await postRegisterToken(() => mock)(mReq, mRes)

        expect(mRes.status.calledWith(200)).equal(true)
        
        expect(mock.appId).equal(payload.appId)
        expect(mock.data['deviceToken']).equal(payload.deviceToken)
        expect(mock.data['deviceType']).equal(payload.deviceType)
        expect(mock.data['appVersion']).equal(payload.version)
    })

    it('empty payload', async () => {
        const mReq = mockRequest({method: "POST"}),
            mRes = mockResponse()
        
        const mock = new MockDeviceToken()
        
        await postRegisterToken(() => mock)(mReq, mRes)
        
        expect(mRes.status.calledWith(400)).equal(true)
    })

    it('wrong deviceType', async () => {
        const payload = {
            appId: "com.dekd.apps.admission",
            deviceToken: "1234567890",
            deviceType: "aaaaaaaaa", //wrong!
            version: "2.2.2",
        }

        const mReq = mockRequest({method: "POST", body: payload}),
            mRes = mockResponse()
        
        const mock = new MockDeviceToken()
        await postRegisterToken(() => mock)(mReq, mRes)

        expect(mRes.status.calledWith(500)).equal(true)
    })
})