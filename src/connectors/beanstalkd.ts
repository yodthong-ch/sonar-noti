import JackdClient from 'jackd'
import { get, isEmpty } from 'lodash'
import { aliases, servers, tubes } from '../config/beanstalk'
import { ApplicationEnvironment } from '../config/app'

const connections:{[server: string]: JackdClient} = {}

export const connect = async (tube = 'default') => {
  const tubeSelect = tubes[tube]
  if (!tubeSelect) {
    throw new Error(`Beanstalkd tube name '${tube}' doesn't exist`)
  }

  const targetServer = aliases[tubeSelect.server || 'default']
  const options = servers[ApplicationEnvironment][targetServer]
  if (!options)
  {
    throw new Error(`Beanstalkd server name '${targetServer}' doesn't exist`)
  }

  let connection = connections[tubeSelect.name]
  if (!connection)
  {
    connection = new JackdClient()
    
    await connection.connect({
      host: options.host,
      port: options.port,
    })
    await connection.use(tubeSelect.name)
    connections[tubeSelect.name] = connection
  }

  return connection
}

export default connect
