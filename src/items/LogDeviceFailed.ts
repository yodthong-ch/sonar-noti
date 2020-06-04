type LogDeviceFailed = {
    _id?: string,
    headerId: string,
    createAt: Date,
    program: string,
    appId: string,
    chunk: number,
    userId: number,
    deviceToken: string,
    error?: string,
}

export default LogDeviceFailed