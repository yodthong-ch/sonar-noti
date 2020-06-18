import JackdClient from 'jackd'
import { get, isEmpty } from 'lodash'
import { aliases, servers, tubes } from '../config/beanstalk'
import { applicationEnvironment } from '../config/app'
import QueueInterface, { PutOption } from './QueueInterface'

const connections:{[tube: string]: BeanstalkQueue} = {}

const connect = async (server = 'default') => {

  const targetServer = aliases[server || 'default']
  const options = servers[applicationEnvironment][targetServer]
  if (!options)
  {
    throw new Error(`Beanstalkd server name '${targetServer}' doesn't exist`)
  }

  const connection = new JackdClient()
    
  await connection.connect({
    host: options.host,
    port: options.port,
  })

  // await connection.use(tubeSelect.name)

  return connection
}

class BeanstalkQueue implements QueueInterface {
  private bt: JackdClient
  private tubeName: string

  constructor(server: JackdClient, tubeName: string)
  {
    this.bt = server
    this.tubeName = tubeName
  }

  async put(payload: string, {delay}:PutOption = {}): Promise<void> {
    await this.bt.use(this.tubeName)
    await this.bt.put(payload, { delay })
  }
}

export const create = async(tubeName: string) => {
  const tubeSelect = tubes[tubeName]
  if (!tubeSelect)
  {
    throw new Error(`${tubeName} not configurated`)
  }

  let conn = connections[tubeName]
  if (!conn)
  {
    const conenctor = await connect(tubeSelect.server)
    conn = new BeanstalkQueue(conenctor, tubeSelect.name)
    connections[tubeName] = conn
  }
  return conn
}

export default create
