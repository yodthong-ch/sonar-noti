export const applicationEnvironment = process.env['APP_ENV'] || 'production'
export const key = process.env['PRIVATE_KEY']
export const publicPort = 9000
export const privatePort = 9001
export const clusterName = process.env['CLUSTERNAME'] || 'localhost'