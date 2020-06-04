import {clusterName, privatePort, key} from '../config/app'

import axios from 'axios'
import {AES} from '../helpers/crypt'

type ClusterRequestOptions = {
    directTo?: string,
}

export const clusterRequest =  async(endpoint: string, params: any, options: ClusterRequestOptions = {}) => {
    const encData = AES.encrypt(JSON.stringify({
        params,
        time: Date.now(),
    }), key!)

    return await axios.post(`http://${options.directTo || clusterName}:${privatePort}/${endpoint}`, encData, {
        headers: {
            'Content-Type': 'text/plain',
        }
    })
}