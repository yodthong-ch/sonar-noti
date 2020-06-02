export const ApplicationEnvironment = process.env['APP_ENV'] || 'production'
export const Key = process.env['PRIVATE_KEY']
export const PublicPort = 9000
export const PrivatePort = 9001
export const ClusterName = process.env['CLUSTERNAME'] || 'localhost'