import {Express} from 'express'
import DeviceToken from '../repositories/DeviceToken'
import LogHeader from '../repositories/LogHeader'
import {postQueue} from './queue'
import postLogFailed from './log'
import LogDeviceFailedRepository from '../repositories/LogDeviceFailed'
import { postRegisterToken } from './register'
export default (app:Express) => {

    app.post('/register', postRegisterToken(() => DeviceToken.make()))
    app.post('/queue', postQueue(() => DeviceToken.make(), () => LogHeader.make() ))
    app.post('/log', postLogFailed(() => LogDeviceFailedRepository.make()))
}