export const applicationEnvironment = process.env['APP_ENV'] || 'production'
export const key = process.env['APP_PRIVATE_KEY']
export const publicPort = 9000
export const privatePort = 9001
export const clusterName = process.env['APP_CLUSTERNAME'] || 'localhost'
export const clusterDiscovery = process.env['APP_CLUSTERDISCOVERY'] || clusterName

export const limitToken = parseInt(process.env['APP_LIMIT_TOKEN'] || '5000')
export const limitUser = parseInt(process.env['APP_LIMIT_USER'] || '1000')
export const limitPrivateConn = parseInt(process.env['APP_LIMIT_PRIVATE_CONN'] || '2')
