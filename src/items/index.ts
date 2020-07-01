/** Type Config */

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

/** Type General */

export type InputQueueTarget = {
    appId: string,
    userIds?: number[],
    deviceType?: string,
}

export type InputQueuePayload = {[x:string]: any}

export type InputQueue = {
    payload: InputQueuePayload,
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

export type Token = {
  id: string,
  token: string,
  appId: string,
  deviceType: string,
  userId?: number,
  activate: boolean,
}

export type LogHeader = {
  _id?: string,
  createAt: Date,
  doneAt?: Date,
  program: string,
  tags?: string[],
  chunks: {no: number, status: boolean}[],
  payload: {[x:string]: any},
  target: {
      appId: string,
      userIds?: number[],
      deviceMatch: number,
  },
  status: string,
}

export type InputLogDeviceFailed = {
  headerId: string,
  program: string,
  appId: string,
  chunk: number,
  userId: number,
  deviceToken: string,
  error?: string,
}