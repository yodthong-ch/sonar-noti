import { Mongoose, USER_SERVICE, connect } from '../../../connectors/mongodb'

const service = USER_SERVICE
const collection = 'devices'

const schemaOptions = {
  collection,
  versionKey: false,
}
const schema = new Mongoose.Schema(
  {
    appId: { type: String, required: true },
    deviceToken: { type: String, required: true },
    deviceType: { type: String, required: true },
    installationId: String,
    appName: String,
    badge: Number,
    createAt: Date,
    userId: Number,
    appVersion: String,
    updateAt: Date,
    activate: Boolean,
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
