import {MongoDBGroupConfig} from '../items'

const config:MongoDBGroupConfig = {
  production: {
    service_notification: 
      'mongodb://mongo_dekd:yaitomyum@192.168.100.226,192.168.100.227,192.168.100.228/service_notification?replicaSet=rs2&authSource=admin',
    service_user:
      'mongodb://mongo_dekd:yaitomyum@192.168.100.226,192.168.100.227,192.168.100.228/service_user?replicaSet=rs2&authSource=admin',
  },
  development: {
    service_notification:
      'mongodb://mongo_dekd:yaitomyum@172.17.100.114,172.17.100.116,172.17.100.117/service_notification?replicaSet=dev-rs2&authSource=admin',
    service_user:
      'mongodb://mongo_dekd:yaitomyum@172.17.100.114,172.17.100.116,172.17.100.117/service_user?replicaSet=dev-rs2&authSource=admin',
  },
  local: {
    service_notification: 'mongodb://mongodb/service_notification',
    service_user: 'mongodb://mongodb/service_user',
  },
}

export default config