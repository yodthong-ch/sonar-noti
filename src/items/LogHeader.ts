type LogHeader = {
    _id?: string,
    createAt: Date,
    doneAt?: Date,
    program: string,
    tags?: string[],
    chunks: {_id: false, no: number, status: boolean}[],
    message: {[x:string]: any},
    target: {
        appId: string,
        userId?: number[],
        deviceMatch: number,
    },
    status: string,
}

export default LogHeader