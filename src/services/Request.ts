import {clusterName, privatePort, key} from '../config/app'

import axios, {AxiosResponse} from 'axios'
import {AES} from '../helpers/crypt'

type ClusterRequestOptions = {
    directTo?: string,
}

export type ClusterRequestFunc = <T = any>(endpoint: string, params: any, options?: ClusterRequestOptions)=>Promise<AxiosResponse<T>>

export const clusterRequest:ClusterRequestFunc = async <T = any>(endpoint: string, params: any, options: ClusterRequestOptions = {}) => {
    const encData = AES.encrypt(JSON.stringify({
        params,
        time: Date.now(), //nounce
    }), key!)

    const result = await axios.post<T>(`http://${options.directTo || clusterName}:${privatePort}/${endpoint}`, encData, {
        headers: {
            'Content-Type': 'text/plain',
        }
    })

    return result.data
}