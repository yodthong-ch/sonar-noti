import dns from 'dns'

export const lookupIPs = (hostname: string):Promise<string[]> => {
    return  new Promise<string[]>( (res, rej) => dns.lookup(hostname, {all: true}, (err, addr) => {
        if (err)
        {
            return rej(err.message)
        }

        return res(addr.map( item => item.address))
    }))
}