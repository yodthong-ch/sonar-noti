import express from 'express'
import PrivateAPI from './private'
import PublicAPI from './public'

import {PublicPort, PrivatePort} from './config/app'

const app = express(),
    privateApp = express()
app.use(express.json())
privateApp.use(express.text())
PrivateAPI(privateApp)
PublicAPI(app)

app.listen(PublicPort, () => {
    console.log(`Running Public API :${PublicPort}`)
})

privateApp.listen(PrivatePort, () => {
    console.log(`Running Private API :${PrivatePort}`)
})