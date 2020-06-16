import express from 'express'
import PrivateAPI from './private'
import PublicAPI from './public'
import {publicPort, privatePort} from './config/app'
import ReadyMiddleware from './middlewares/ready'
import './libs/state'
import { getState } from './libs/state'

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
    console.log(`Running Public API :${publicPort}`)
})

privateApp.listen(privatePort, () => {
    console.log(`Running Private API :${privatePort}`)
})