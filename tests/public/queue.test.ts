import { expect } from 'chai'
import { match, stub } from 'sinon'
import {mockRequest, mockResponse} from 'mock-req-res'
import { MockDeviceToken, sampleData as sampleDataToken } from '../mock/DeviceToken'
import { MockLogHeader } from '../mock/LogHeader'
import { InputQueue } from '../../src/items'
import { postQueue } from '../../src/public/queue'
import { ClusterRequestFunc } from '../../src/services/Request'

describe('endpoint - public queue', () => {
    it('queue messaging', async () => {
        const payload:InputQueue = {
            program: "testing",
            payload: {
                data: {
                    test: "test",
                },
            },
            target: {
                appId: "com.dekd.apps.admission",
            }
        }

        const expectedDeviceMatch = sampleDataToken.filter( item => item.appId === 'com.dekd.apps.admission' && item.activate ).length

        const mReq = mockRequest({method: "POST", body: payload}),
            mRes = mockResponse()

        const mock = new MockDeviceToken(),
            mockLog = new MockLogHeader(),
            mockCluster:ClusterRequestFunc = async () => {
                return true;
            }
        
        await postQueue(() => mock, () => mockLog, ()=>mockCluster)(mReq, mRes)

        expect(mRes.status.calledWith(200)).equal(true)

        const expected = {
            ack: true,
            total: expectedDeviceMatch,
            id: mockLog.getId(),
        }

        expect(mRes.send.calledWith(match(expected))).equal(true)
    })

    it('queue messaging - empty request', async () => {

        const mReq = mockRequest({method: "POST", body: ''}),
            mRes = mockResponse()

        const mock = new MockDeviceToken(),
            mockLog = new MockLogHeader(),
            mockCluster:ClusterRequestFunc = async () => {
                return true;
            }
        
        await postQueue(() => mock, () => mockLog, ()=>mockCluster)(mReq, mRes)

        expect(mRes.status.calledWith(500)).equal(true)
    })


})