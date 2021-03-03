import {BeanstalkServerStaging} from '../items'

export const servers:BeanstalkServerStaging = {
    default: {
        host: process.env.APP_BEANSTALK_HOST || 'localhost',
        port: Number(process.env.APP_BEANSTALK_PORT || '11300'),
    },
}

export const aliases:{[name: string]: string} = {
    default: 'default',
}

type TubeServer = {
  name: string,
  server: string,
}
  
export const tubes:{[name: string]: TubeServer} = {
    default: {
        name: 'default',
        server: 'default',
    },
    LegacyNotification: {
        name: 'notification.legacy',
        server: 'default'
    },
}

export default {
    servers,
    aliases,
    tubes,
}

