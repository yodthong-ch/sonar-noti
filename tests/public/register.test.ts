import { expect } from 'chai'
import {mockRequest, mockResponse} from 'mock-req-res'
import { postRegisterToken } from '../../src/public/register'
import { MockDeviceToken } from '../mock/DeviceToken'

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