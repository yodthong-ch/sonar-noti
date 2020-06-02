export type InputQueueTarget = {
    appId: string,
    userId?: number[],
    deviceType?: string,
}

export type InputQueueMessage = {[x:string]: any}

export type InputQueue = {
    message: InputQueueMessage,
    target: InputQueueTarget,
    tags?: string[],
}

export type ChunkPacket = {
    headerId: string,
    target: InputQueueTarget,
    offset: number,
    limit: number,
}