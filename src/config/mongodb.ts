type MongoDBConfig = string

type MongoDBGroupConfig = {
  [staging: string]: {
    [db:string]: MongoDBConfig
  }
}

const config:MongoDBGroupConfig = {
  production: {
    school:
      'mongodb://mongo_dekd:yaitomyum@192.168.100.226,192.168.100.227,192.168.100.228/service_school?replicaSet=rs2&authSource=admin',
    service_article:
      'mongodb://mongo_dekd:yaitomyum@192.168.100.226,192.168.100.227,192.168.100.228/service_article?replicaSet=rs2&authSource=admin',
    service_board:
      'mongodb://mongo_dekd:yaitomyum@192.168.100.226,192.168.100.227,192.168.100.228/service_board?replicaSet=rs2&authSource=admin',
    service_notification: 
      'mongodb://mongo_dekd:yaitomyum@192.168.100.226,192.168.100.227,192.168.100.228/service_notification?replicaSet=rs2&authSource=admin',
    service_user:
      'mongodb://mongo_dekd:yaitomyum@192.168.100.226,192.168.100.227,192.168.100.228/service_user?replicaSet=rs2&authSource=admin',
    service_writer:
      'mongodb://mongo_dekd:yaitomyum@192.168.100.226,192.168.100.227,192.168.100.228/service_writer?replicaSet=rs2&authSource=admin',
  },
  development: {
    school:
      'mongodb://mongo_dekd:yaitomyum@172.17.100.114,172.17.100.116,172.17.100.117/service_school?replicaSet=dev-rs2&authSource=admin',
    service_article:
      'mongodb://mongo_dekd:yaitomyum@172.17.100.114,172.17.100.116,172.17.100.117/service_article?replicaSet=dev-rs2&authSource=admin',
    service_board:
      'mongodb://mongo_dekd:yaitomyum@172.17.100.114,172.17.100.116,172.17.100.117/service_board?replicaSet=dev-rs2&authSource=admin',
    service_notification:
      'mongodb://mongo_dekd:yaitomyum@172.17.100.114,172.17.100.116,172.17.100.117/service_notification?replicaSet=dev-rs2&authSource=admin',
    service_user:
      'mongodb://mongo_dekd:yaitomyum@172.17.100.114,172.17.100.116,172.17.100.117/service_user?replicaSet=dev-rs2&authSource=admin',
    service_writer:
      'mongodb://mongo_dekd:yaitomyum@172.17.100.114,172.17.100.116,172.17.100.117/service_writer?replicaSet=dev-rs2&authSource=admin',
  },
  local: {
    school: 'mongodb://mongodb/school',
    service_article: 'mongodb://mongodb/service_article',
    service_board: 'mongodb://mongodb/service_board',
    service_notification: 'mongodb://mongodb/service_notification',
    service_user: 'mongodb://mongodb/service_user',
    service_writer: 'mongodb://mongodb/service_writer',
  },
}

export default config