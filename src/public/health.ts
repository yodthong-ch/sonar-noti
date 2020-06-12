import {Request, Response} from 'express'
import { ClusterRequestFunc } from '../services/Request'
import os from 'os'
import { lookupIPs } from '../helpers/dns'

export const getHealthCheck = (clusterName: string, clusterDiscovery: string, ClusterRequestDI:()=>ClusterRequestFunc) =>
    async (req: Request, res: Response) => {
        const clusterRequest = ClusterRequestDI()
        try
        {
            const clusterIps = await lookupIPs(clusterDiscovery)

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