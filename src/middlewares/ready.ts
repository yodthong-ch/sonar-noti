import * as Express from 'express'

export type Middleware = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => void
export default (ShutdownStateDI: ()=>boolean):Middleware => 
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        if (ShutdownStateDI())
        {
            res.status(503).send({error: 'Service Unavailable'})
            return;
        }

        next()
    }