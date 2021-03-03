import JackdClient from 'jackd'
import { aliases, servers, tubes } from '../config/beanstalk'
import QueueInterface, { PutOption } from './QueueInterface'

const connections:{[tube: string]: BeanstalkQueue} = {}

const connect = async (server = 'default'):Promise<JackdClient> => {

    const targetServer = aliases[server || 'default']
    const options = servers[targetServer]
    if (!options)
    {
        throw new Error(`Beanstalkd server name '${targetServer}' doesn't exist`)
    }

    const connection = new JackdClient()
    
    console.log("bt-options", options)
    await connection.connect({
        host: options.host,
        port: options.port,
    })

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
      await this.bt.put(payload, { delay })
  }
}

export const create = async(tubeName: string):Promise<QueueInterface> => {
    const tubeSelect = tubes[tubeName]
    if (!tubeSelect)
    {
        throw new Error(`${tubeName} not configurated`)
    }

    if (!connections[tubeName])
    {
        const conenctor = await connect(tubeSelect.server)
        await conenctor.use(tubeSelect.name)
        connections[tubeName] = new BeanstalkQueue(conenctor, tubeSelect.name)
    }

    return connections[tubeName]
}

export default create
