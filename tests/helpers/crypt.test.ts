import {AES} from '../../src/helpers/crypt'
import { expect } from 'chai'

const key = 'aabbccddeeff' + Date.now()
const plantext = 'test123' + Date.now()

describe('AES encryption', () => {
    it('encrypt/decrypt', () => {
        const enc = AES.encrypt(plantext, key);
        const dec = AES.decrypt(enc, key)
        
        expect(dec).equal(plantext)
    })
})