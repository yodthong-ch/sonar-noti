import { Mongoose, USER_SERVICE, connect } from '../../../connectors/mongodb'

const service = USER_SERVICE
const collection = 'devices'

const schemaOptions = {
    collection,
    versionKey: false,
}
const schema = new Mongoose.Schema(
    {
        appId: { type: Mongoose.Schema.Types.String, required: true },
        deviceToken: { type: Mongoose.Schema.Types.String, required: true },
        deviceType: { type: Mongoose.Schema.Types.String, required: true },
        installationId: Mongoose.Schema.Types.String,
        appName: Mongoose.Schema.Types.String,
        badge: Mongoose.Schema.Types.Number,
        createAt: Mongoose.Schema.Types.Date,
        userId: Mongoose.Schema.Types.Number,
        appVersion: Mongoose.Schema.Types.String,
        updateAt: Mongoose.Schema.Types.Date,
        activate: Mongoose.Schema.Types.Boolean,
        token: Mongoose.Schema.Types.Mixed,
    },
    schemaOptions
)

schema.index({ appId: 1, deviceType: 1, deviceToken: 1 }, { unique: true })
schema.index({ userId: 1, appId: 1 })
schema.index({ appId: 1, deviceType: 1, installationId: 1 })

export default connect({
    service,
    collection,
    schema,
})
