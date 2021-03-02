export type PutOption = {
    delay?: number, // in seconds
}

interface QueueInterface {
    put(payload: any, options?: PutOption):Promise<void>
}

export default QueueInterface
