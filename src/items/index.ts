// import { PutOption } from "../connectors/QueueInterface";
import {Message} from '@dek-d/notification-core'
/** Type Config */

/**Deprecated */ 
export type BeanstalkServerConfig = {
  host: string,
  port: number,
}

export type BeanstalkServerStaging = {
    [name:string]: BeanstalkServerConfig,
}
/**End Deprecated */ 

export type MongoDBConfig = string

export type MongoDBGroupConfig = {
  [staging: string]: string
}

/** Type General */

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
  options?: Message.InputQueueOptions,
  status: string,
}

