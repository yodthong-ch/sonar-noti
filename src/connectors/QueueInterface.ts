export type PutOption = {
    delay?: number,
}

interface QueueInterface {
    put(payload: any, options?: PutOption):Promise<void>
}

export default QueueInterface