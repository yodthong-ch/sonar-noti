import LogHeader from "../../items/LogHeader";

interface LogHeaderInterface {
    store(item:LogHeader):Promise<string>

    setHeaderId(id: string): LogHeaderInterface
    getHeaderId(): string

    getHeader(): Promise<LogHeader | null>
    chunkState(no: number, status: boolean): Promise<void>
    flagDone(): Promise<boolean>
}

export default LogHeaderInterface