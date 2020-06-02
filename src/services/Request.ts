import {ClusterName, PrivatePort, Key} from '../config/app'

import axios from 'axios'
import {AES} from '../helpers/crypt'

export const ClusterRequest =  async(endpoint: string, params: any) => {
    const encdata = AES.encrypt(JSON.stringify(params), Key!)

    return await axios.post(`http://${ClusterName}:${PrivatePort}/${endpoint}`, encdata, {
        headers: {
            'Content-Type': 'text/plain',
        }
    })
}