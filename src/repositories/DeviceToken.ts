import DeviceTokenInterface from "./interfaces/DeviceTokenInterface"
import DeviceTokenModel from '../models/mongo/service_user/devices'
import Token from "../items/Token"
import appIds, { DeviceType, convertDeviceType2Text } from '../config/appid'

type QueryParams = {[option: string]: any}

type FilterType = {
    appId?: string,
    deviceType?: string,
    userIds?: number[],
}

class DeviceToken implements DeviceTokenInterface {
    private filter:FilterType = {}
    static make() {
        return new DeviceToken()
    }

    public setAppId(value: string)
    {
        this.filter.appId = value
        return this
    }

    public setDeviceType(value: string)
    {
        this.filter.deviceType = value
        return this
    }

    public setUserIds(userIds: number[])
    {
        this.filter.userIds = userIds
        return this
    }

    public clearUserIds()
    {
        this.filter.userIds = undefined
        return this
    }

    async register(appVersion: string, deviceType: DeviceType, deviceToken: string, userId?: number):Promise<boolean> {
        const {appId} = this.filter

        if (!appId)
        {
            throw new Error(`appId require`)
        }

        if (!appIds[appId])
        {
            throw new Error(`appId invalid`)
        }

        if ( appIds[appId].support.indexOf(deviceType) < 0 )
        {
            throw new Error(`deviceType not support in appId`)
        }

        const deviceTypeTxt = convertDeviceType2Text(deviceType)

        const data = {
            $setOnInsert: {
                createAt: Date.now(),
            },
            $set: {
                deviceType: deviceTypeTxt,
                appVersion,
                userId: userId || 0,
                updateAt: Date.now(),
                activate: true,
            },
        }

        const row = await DeviceTokenModel.findOneAndUpdate({
            appId,
            deviceType: deviceTypeTxt,
            deviceToken,
        }, data, { new: true, upsert: true }).exec()
        return !!row
    }

    private _query() {
        if (!this.filter.appId)
        {
            throw new Error("require appId")
        }

        let query:QueryParams = {
            appId: this.filter.appId,
            activate: true,
        }

        if (this.filter.userIds && this.filter.userIds.length > 0)
        {
            query = {
                ...query,
                userId: {
                    '$in': this.filter.userIds,
                }
            }
        }

        return query
    }

    async count(): Promise<number> {
        const query = this._query()
        const total = await DeviceTokenModel.countDocuments(query)

        return total
    }

    async execute(): Promise<Token[]> {
        const total = await this.count()

        if (total > 1000)
        {
            throw new Error(`token too large, please chunk condition`)
        }
        
        const query = this._query()
        const qresult = await DeviceTokenModel.find(query)
            .sort({ _id: 1 }).exec()
        
        return qresult.map<Token>( item => {
            return {
                id: item._id,
                token: item.get('deviceToken'),
                appId: item.get('appId'),
                deviceType: item.get('deviceType'),
                userId: item.get('userId'),
                activate: item.get('activate'),
            }
        })
    }

    async chunk(offset: number, limit: number): Promise<Token[]> {
        if (offset < 0)
        {
            throw new RangeError('offset must positive number')
        }
        if (limit < 1)
        {
            throw new RangeError('offset must more zero')
        }

        const query = this._query()

        const qresult = await DeviceTokenModel.find(query).sort({ _id: 1 }).skip(offset).limit(limit).exec()
        
        return qresult.map<Token>( item => {
            return {
                id: item._id,
                token: item.get('deviceToken'),
                appId: item.get('appId'),
                deviceType: item.get('deviceType'),
                userId: item.get('userId'),
                activate: item.get('activate'),
            }
        })
    }
    
}

export default DeviceToken