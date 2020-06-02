import {Express} from 'express'
import DeviceToken from '../repositories/DeviceToken'
import LogHeader from '../repositories/LogHeader'
import {postQueue} from './queue'
import {ClusterRequest} from '../services/Request'
export default (app:Express) => {

    app.get('/register', async (_, res) => {
        // const result = await model.find({userId: 3033785}).exec()
        /*const query = DeviceToken.make().setAppId('com.dekd.school').setUserIds([3033785])
        
        const result = await query.execute()
        res.send(result)*/
        const ok = await DeviceToken.make().setAppId('com.dekd.school').register("2.2.2", "web", "abcdef")
        res.send(ok ? "OK " : "FAILED")
    })

    app.get('/test', async(_, res) => {
        try{
            const res1 = await ClusterRequest('chunk', {a: 'ไทยๆ'})

            res.send(res1.data)
        }
        catch (err){
            console.error(err)
            res.send(err)
        }
    })

    app.post('/queue', postQueue(() => DeviceToken.make(), () => LogHeader.make() ))
}