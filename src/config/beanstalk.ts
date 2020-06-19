import {BeanstalkServerStaging} from '../items'

export const servers:BeanstalkServerStaging = {
    production: {
      default: {
        host: '192.168.100.230',
        port: 11300,
      },
    },
    development: {
      default: {
        host: '172.17.100.132',
        port: 11300,
      },
    },
    local: {
      default: {
        host: 'localhost',
        port: 11300,
      },
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
    NODE_QUEUE: {
      name: 'notification.queue',
      server: 'default'
    },
    FIREBASE_API: {
      name: 'api.firebase',
      server: 'default',
    },
  }

  export default {
    servers,
    aliases,
    tubes,
  }
  