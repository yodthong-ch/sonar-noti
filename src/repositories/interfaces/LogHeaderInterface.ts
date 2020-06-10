import LogHeader from "../../items/LogHeader";

interface LogHeaderInterface {
    save(item:LogHeader):Promise<string>

    setId(id: string): LogHeaderInterface
    getId(): string

    getHeader(): Promise<LogHeader | null>
    chunkState(no: number, status: boolean): Promise<void>
    flagDone(): Promise<boolean>
}

export default LogHeaderInterface