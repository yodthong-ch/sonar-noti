import LogHeaderInterface from "../../src/repositories/interfaces/LogHeaderInterface"
import {default as LogHeaderItem} from "../../src/items/LogHeader"

const sampleData: LogHeaderItem[] = [
    {
        _id: "5eddedbcf3e817a6cc3c58a5",
        createAt: new Date(),
        program: "tcasapp",
        tags: ["hotnews", "hotnews:2010101"],
        payload: {
            data: {
                title: "Test",
                description: "Test",
            }
        },
        chunks: [],
        target: {
            appId: "com.dekd.apps.admission",
            deviceMatch: 1235,
        },
        status: 'P',
    }
]

var mockObjectID = () => {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

export class MockLogHeader implements LogHeaderInterface {
    private _id?: string

    async save(item: LogHeaderItem): Promise<string> {
        const mockId = mockObjectID()
        sampleData.push({
            _id: mockId,
            createAt: new Date(),
            program: item.program,
            tags: item.tags,
            payload: item.payload,
            chunks: [],
            target: {
                appId: item.target.appId,
                userIds: item.target.userIds,
                deviceMatch: item.target.deviceMatch,
            },
            status: 'P',
        })

        this._id = mockId
        return mockId
    }

    valid() {
        if (!this._id) throw new Error(`no set id`)
    }

    setId(id: string): LogHeaderInterface {
        this._id = id
        return this
    }

    getId(): string {
        this.valid()

        return this._id!
    }

    async getHeader(): Promise<LogHeaderItem | null> {
        this.valid()

        return sampleData.find( item => item._id === this._id) || null
    }

    async chunkState(no: number, status: boolean): Promise<void> {
        this.valid()

        const idx = sampleData.findIndex( item => item._id === this._id)
        if (idx < 0) return;

        const idxChunk = sampleData[idx].chunks.findIndex( itemChunk => itemChunk.no === no )

        if (idxChunk < 0)
        {
            sampleData[idx].chunks.push({
                no,
                status,
            })
        }
        else
        {
            sampleData[idx].chunks[idxChunk].status = status
        }
    }

    async flagDone(): Promise<boolean> {
        this.valid()

        const idx = sampleData.findIndex( item => item._id === this._id)
        if (idx >= 0)
        {
            sampleData[idx].status = 'S'
            sampleData[idx].doneAt = new Date()
        }

        return true
    }
}

export default MockLogHeader