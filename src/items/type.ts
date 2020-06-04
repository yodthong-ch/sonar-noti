export type BeanstalkServerConfig = {
    host: string,
    port: number,
  }
  
export type BeanstalkServerStaging = {
    [staging:string]: {
      [name:string]: BeanstalkServerConfig,
    }
  }

export type MongoDBConfig = string

export type MongoDBGroupConfig = {
  [staging: string]: {
    [db:string]: MongoDBConfig
  }
}

export type InputQueueTarget = {
    appId: string,
    userIds?: number[],
    deviceType?: string,
}

export type InputQueueMessage = {[x:string]: any}

export type InputQueue = {
    message: InputQueueMessage,
    program: string,
    target: InputQueueTarget,
    tags?: string[],
}

export type ChunkPacket = {
    headerId: string,
    target: InputQueueTarget,
    offset: number,
    limit: number,
}

export type InputDeviceLogFailed = {
    headerId: string,
    program: string,
    appId: string,
    deviceToken: string,
    userId: number,
    chunk: number,
    error: string,
}

export type InputRegisterToken = {
    appId: string,
    deviceToken: string,
    deviceType: string,
    version: string,
    userId?: number,
}

export type InputPrivateParams = {
  params: any,
  time: number,
}