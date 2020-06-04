import {Request, Response} from 'express'
import { clusterRequest } from '../services/Request'
import os from 'os'
import { LookupIPs } from '../helpers/dns'

export const getHealthCheck = (clusterName: string) =>
    async (req: Request, res: Response) => {
        try
        {
            const clusterIps = await LookupIPs(clusterName)

            res.send({
                me: os.hostname(),
                clusterName,
                clusterCount: clusterIps.length,
                clusters: await Promise.all(clusterIps.map( async ip => {
                    try
                    {
                        await clusterRequest('health', {}, {directTo: ip})

                        return {
                            ip,
                            ok: true,
                        }
                    }
                    catch(err1)
                    {
                        return {
                            ip,
                            ok: false,
                            error: err1.message,
                        }
                    }
                }))
            })
        }
        catch (err)
        {
            res.status(500).send(err.message)
        }
    }