import {MongoDBGroupConfig} from '../items'

type ConnectionInfo = {
  host: string,
  user?: string,
  pass?: string,
  replicaSet?: string,
}

const generateConnectionString = (connectionInfo: ConnectionInfo, database: string) => {
    const { host, user, pass, replicaSet } = connectionInfo

    const credential = user ? `${user}:${pass}@` : ''

    return `mongodb://${credential}${host}/${database}?authSource=admin${
        replicaSet ? `&replicaSet=${replicaSet}` : ''
    }`
}

const serverConfig:ConnectionInfo = {
    host: process.env.DEKD_MONGO_HOST || 'localhost',
    user: process.env.DEKD_MONGO_USER,
    pass: process.env.DEKD_MONGO_PASS,
    replicaSet: process.env.DEKD_MONGO_REPLICA_SET,
}

const config:MongoDBGroupConfig = {
    service_notification: generateConnectionString(serverConfig, 'service_notification'),
    service_user: generateConnectionString(serverConfig, 'service_user'),
}

export default config