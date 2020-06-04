import {clusterName, privatePort, key} from '../config/app'

import axios from 'axios'
import {AES} from '../helpers/crypt'

export const ClusterRequest =  async(endpoint: string, params: any) => {
    const encdata = AES.encrypt(JSON.stringify(params), key!)

    return await axios.post(`http://${clusterName}:${privatePort}/${endpoint}`, encdata, {
        headers: {
            'Content-Type': 'text/plain',
        }
    })
}