import {Request, Response} from 'express'
import os from 'os'

export const postHealthCheck = () =>
    async (req: Request, res: Response):Promise<void> => {
        res.send({host: os.hostname(), ok: true})
    }