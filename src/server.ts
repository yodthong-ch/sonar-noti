import express from 'express'
import PrivateAPI from './private'
import PublicAPI from './public'

import {publicPort, privatePort} from './config/app'

const app = express(),
    privateApp = express()

app.use(express.json())
privateApp.use(express.text())

PrivateAPI(privateApp)
PublicAPI(app)

app.get('/health', (_, res) => res.send('OK'))

app.listen(publicPort, () => {
    console.log(`Running Public API :${publicPort}`)
})

privateApp.listen(privatePort, () => {
    console.log(`Running Private API :${privatePort}`)
})