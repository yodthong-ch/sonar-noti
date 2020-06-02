import LogHeaderInterface from "./interfaces/LogHeaderInterface"
import LogHeaderModel from '../models/mongo/service_notification/log_header'

import {default as LogHeaderItem} from "../items/LogHeader"

class LogHeader implements LogHeaderInterface {
    private _id?: string

    static make(): LogHeaderInterface
    {
        return new LogHeader()
    }

    async store(item: LogHeaderItem): Promise<string> {
        const createHdr = await LogHeaderModel.create({
            createAt: new Date(),
            program: item.program,
            tags: item.tags,
            message: item.message,
            chunks: [],
            target: {
                appId: item.target.appId,
                userId: item.target.userId,
                deviceMatch: item.target.deviceMatch,
            },
            status: 'P',
        })

        this._id = createHdr._id
        return createHdr._id
    }

    valid() {
        if (!this._id) throw new Error(`no set id`)
    }

    setHeaderId(id: string): LogHeaderInterface {
        this._id = id
        return this
    }

    getHeaderId(): string {
        this.valid()

        return this._id!
    }

    async getHeader(): Promise<LogHeaderItem | null> {
        this.valid()

        const result = await LogHeaderModel.findOne({_id: this._id})

        if (!result) return null

        return {
            _id: result._id,
            createAt: result.get('createAt'),
            program: result.get('program'),
            message: result.get('message'),
            chunks: result.get('chunks'),
            target: result.get('target'),
            status: result.get('status'),
        }
    }

    async chunkState(no: number, status: boolean): Promise<void> {
        this.valid()

        await LogHeaderModel.updateOne({
            _id: this._id,
        }, {
            $addToSet: {
                chunks: {no, status}
            }
        })
    }

    async flagDone(): Promise<boolean> {
        this.valid()

        //throw new Error("Method not implemented.");
        await LogHeaderModel.updateOne({
            _id: this._id
        }, {
            $set: {
                status: 'D',
                doneAt: new Date(),
            }
        })

        return true
    }
}

export default LogHeader