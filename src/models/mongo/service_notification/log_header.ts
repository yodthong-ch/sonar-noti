import { Mongoose, NOTIFICATION_SERVICE, connect } from '../../../connectors/mongodb'

const service = NOTIFICATION_SERVICE
const collection = 'log_header'

const schemaOptions = {
  collection,
  versionKey: false,
}

const schema = new Mongoose.Schema(
  {
    createAt: { require: true, type: Mongoose.Schema.Types.Date},
    doneAt: Date,
    program: { require: true, type: Mongoose.Schema.Types.String },
    tags: [Mongoose.Schema.Types.String],
    message: Mongoose.Schema.Types.Mixed,
    chunks: [{
      _id: false,
      no: {require: true, type: Mongoose.Schema.Types.Number},
      status: {require: true, type: Mongoose.Schema.Types.Boolean},
    }],
    target: {
        appId: { require: true, type: Mongoose.Schema.Types.String },
        userId: [Mongoose.Schema.Types.Number],
        deviceMatch: Mongoose.Schema.Types.Number,
    },
    status: Mongoose.Schema.Types.String,
  },
  schemaOptions
)

schema.index({ program:1, tags: 1 })

export default connect({
  service,
  collection,
  schema,
})
