import crypto from 'crypto'

export class AES {
    public static encrypt = (payload: string, key: string):string => {
        const iv = crypto.randomBytes(16),
            salt = crypto.randomBytes(64)
        const mkey = crypto.pbkdf2Sync(key, salt, 2145, 32, 'sha512')
        const cipher = crypto.createCipheriv('aes-256-gcm', mkey, iv)

        const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()])

        const tag = cipher.getAuthTag()
        return Buffer.concat([salt, iv, tag, encrypted]).toString('base64')
    }

    public static decrypt = (encdata: string, key: string):string => {
        const bData = Buffer.from(encdata, 'base64')

        const salt = bData.slice(0, 64)
        const iv = bData.slice(64, 80)
        const tag = bData.slice(80, 96)
        const text = bData.slice(96)

        const mkey = crypto.pbkdf2Sync(key, salt, 2145, 32, 'sha512')

        const decipher = crypto.createDecipheriv('aes-256-gcm', mkey, iv)
        decipher.setAuthTag(tag)

        return decipher.update(text, 'binary', 'utf8') + decipher.final('utf8')
    }
}