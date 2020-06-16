import {Express} from 'express'
import DeviceToken from '../repositories/DeviceToken'
import LogHeader from '../repositories/LogHeader'
import {postQueue} from './queue'
import postLogFailed from './log'
import LogDeviceFailedRepository from '../repositories/LogDeviceFailed'
import { postRegisterToken } from './register'
import { clusterName, clusterDiscovery } from '../config/app'
import { getHealthCheck, getLivenessCheck } from './health'
import { clusterRequest } from '../services/Request'
export default (app:Express) => {

    app.post('/register', postRegisterToken(() => DeviceToken.make()))
    app.post('/queue', postQueue(() => DeviceToken.make(), () => LogHeader.make(), () => clusterRequest ))
    app.post('/log', postLogFailed(() => LogDeviceFailedRepository.make()))

    app.get('/health', getHealthCheck(clusterName, clusterDiscovery, () => clusterRequest))
    app.get('/liveness', getLivenessCheck())
}