import {Request, Response} from 'express'
import { ClusterRequestFunc } from '../services/Request'
import os from 'os'
import { lookupIPs } from '../helpers/dns'

import {getState} from '../libs/state'
import log from '../libs/log'

export const getLivenessCheck = () => 
    async (req: Request, res: Response) => {
        const ok = getState('stillAlive') === true ||
            getState('working_queue') === true ||
            getState('working_priv_chunk') === true
        res.status(ok ? 200 : 500).send({ ok })
    }

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
            log.error(err)
        }
    }