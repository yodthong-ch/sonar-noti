import Middleware, { DecodeMiddleware } from '../../src/middlewares/decode'
import {AES} from '../../src/helpers/crypt'
import { expect } from 'chai'
import sinon from 'sinon'
import {mockRequest, mockResponse} from 'mock-req-res'

const key = 'aabbccddeeff' + Date.now()
const plantext = 'test123' + Date.now()
const time = Date.now()
const mesg = { params: plantext, time }

describe('Decode middleware', () => {
    let middleware:DecodeMiddleware
    const encdata = AES.encrypt(JSON.stringify(mesg), key)

    beforeEach(()=>{
        middleware = Middleware(key)
    })

    it('should return a function', ()=>{
        expect(middleware).to.be.a.instanceOf(Function)
    })

    it('decode', () => {
        const nextSpy = sinon.spy()

        const mReq = mockRequest({method: "POST", body: encdata}),
            mRes = mockResponse()

        expect(mReq.body).equal(encdata)
        
        // mock middleware
        middleware(mReq, mRes, nextSpy)
        
        expect(nextSpy.calledOnce).to.be.true;
        expect(mReq.body).equal(plantext)
    })

    it('wrong method', () => {
        const nextSpy = sinon.spy()

        const mReq = mockRequest({method: "GET"}),
            mRes = mockResponse()

        // mock middleware
        middleware(mReq, mRes, nextSpy)
        
        expect(nextSpy.calledOnce).to.be.false;
        expect(mRes.status.calledWith(405)).equal(true)
    })

    it('wrong cipher', () => {
        const nextSpy = sinon.spy()

        const mReq = mockRequest({method: "POST", body: "aygiyguasuihasoiasijecd0jeipjcpi0ewjcjweifjc-ewjfcpwje-ofjw-ejf-ewjf-jew-fjc-qejf-ewjf-wje-fjew-jf-wejfcjwefjewjfijewoifnoenfconsdncvdsnvp"}),
            mRes = mockResponse()

        // mock middleware
        middleware(mReq, mRes, nextSpy)
        
        expect(nextSpy.calledOnce).to.be.false;
        expect(mRes.status.calledWith(500)).equal(true)
    })
})