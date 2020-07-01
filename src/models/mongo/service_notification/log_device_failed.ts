import { Mongoose, NOTIFICATION_SERVICE, connect } from '../../../connectors/mongodb'

const service = NOTIFICATION_SERVICE
const collection = 'log_device_failed'

const schemaOptions = {
  collection,
  versionKey: false,
}

const schema = new Mongoose.Schema(
  {
    headerId: { require: true, type: Mongoose.Schema.Types.ObjectId },
    chunk: { require: true, type: Mongoose.Schema.Types.Number },
    program: { require: true, type: Mongoose.Schema.Types.String },
    appId: { require: true, type: Mongoose.Schema.Types.String },
    deviceToken: { require: true, type: Mongoose.Schema.Types.String },
    createAt: { require: true, type: Mongoose.Schema.Types.Date },
    error: Mongoose.Schema.Types.String,
  },
  schemaOptions
)

schema.index({ headerId: 1 })
schema.index({ program: 1 })
schema.index({ appId: 1, deviceId: 1 })

export default connect({
  service,
  collection,
  schema,
})
