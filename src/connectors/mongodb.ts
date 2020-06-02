import config from '../config/mongodb'
import bluebird from 'bluebird'
import _ from 'lodash'
import mongoose from 'mongoose'
import { ApplicationEnvironment } from '../config/app'

export const connections:{[service: string]: mongoose.Connection} = {}

// Get Mongoose to use the global promise library
mongoose.Promise = bluebird

// Enable - Disable Mongoose's function
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)

export const create = (service:string) => {
  let connection = connections[service]

  if (!connection) {
    const server = config[ApplicationEnvironment][service]

    connection = mongoose.createConnection(server, { poolSize: 30 })

    connection.on('error', err => {
      if (err.message && /failed to connect to server .* on first connect/.test(err.message)) {
        console.log(new Date(), String(err))

        // Wait for a bit, then try to connect again
        setTimeout(() => {
          console.log(`> Mongoose: Retrying to connect to "${service}"...`)
          connection.openUri(server).catch(() => {})

          // delay 5 seconds before retry
        }, 5 * 1000)
      } else {
        // Some other error occurred.  Log it.
        console.error(`> Mongoose:(${new Date()}): ${String(err)}`)
      }
    })

    connection.once('open', () => {
      console.log(`> Mongoose: Connection established to "${service}".`)
    })

    connections[service] = connection
  }

  return connection
}

/**
 * Connect to MongoDB
 * @param  {string} options.service - Service's name
 * @param  {string} options.collection - Collection's name
 * @param  {Schema} options.schema - Collection's schema
 * @param  {string} [options.options] - Model's options ( Override collection name )
 * @return {Model}                          Mongoose's model
 */

type MongoDBConnect<T> = {
  service: string,
  collection: string,
  schema: mongoose.Schema<T>,
}

export const connect = <T>({ service, collection, schema }:MongoDBConnect<T>) => {
  const connection = create(service)
  return connection.model(collection, schema, collection)
}

export const SCHOOL_SERVICE = 'school'
export const ARTICLE_SERVICE = 'service_article'
export const BOARD_SERVICE = 'service_board'
export const NOTIFICATION_SERVICE = 'service_notification'
export const USER_SERVICE = 'service_user'
export const WRITER_SERVICE = 'service_writer'

export const Mongoose = mongoose
