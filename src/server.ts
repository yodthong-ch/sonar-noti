import './env'

import express from 'express'
import PrivateAPI from './private'
import PublicAPI from './public'
import {publicPort, privatePort, key, limitToken, limitUser, clusterName, clusterDiscovery} from './config/app'
import ReadyMiddleware from './middlewares/ready'
import './libs/state'
import { getState, bind as HCBind, EVENT_SHUTDOWN } from './libs/state'
import log from './libs/log'

if (!key)
{
    log.error(`[ERROR] APP_PRIVATE_KEY is unset`)
    process.exit(1)
}

if (limitToken < 1)
{
    log.error(`[ERROR] APP_LIMIT_TOKEN must more than zero`)
    process.exit(1)
}

if (limitUser < 1)
{
    log.error(`[ERROR] APP_LIMIT_USER must more than zero`)
    process.exit(1)
}

log.info(`[INFO] APP_LIMIT_TOKEN=${limitToken}`)
log.info(`[INFO] APP_LIMIT_USER=${limitUser}`)
log.info(`[INFO] APP_CLUSTERNAME=${clusterName}`)
log.info(`[INFO] APP_CLUSTERDISCOVERY=${clusterDiscovery}`)


const app = express(),
    privateApp = express()

const readyMiddle = ReadyMiddleware(
    () => getState('shutdown', false)
)

app.use(readyMiddle)
privateApp.use(readyMiddle)

app.use(express.json())
privateApp.use(express.text())

PrivateAPI(privateApp)
PublicAPI(app)

app.listen(publicPort, () => {
    log.info(`Running Public API :${publicPort}`)
})

privateApp.listen(privatePort, () => {
    log.info(`Running Private API :${privatePort}`)
})

HCBind(EVENT_SHUTDOWN, async()=>{
    log.info("shutting down")
  
    const recheckWorkingState = () => {
      log.warn("check working....")
  
      if (getState('working') !== true)
      {
        log.warn("no working exiting")
        process.exit(0)
      }
      else
      {
        log.warn("still working attempt check....")
        setTimeout(recheckWorkingState, 5000) 
      }
    }
  
    recheckWorkingState()
})
