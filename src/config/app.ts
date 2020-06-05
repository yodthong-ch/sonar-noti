export const applicationEnvironment = process.env['APP_ENV'] || 'production'
export const key = process.env['PRIVATE_KEY']
export const publicPort = 9000
export const privatePort = 9001
export const clusterName = process.env['CLUSTERNAME'] || 'localhost'

export const limitToken = parseInt(process.env['LIMIT_TOKEN'] || '5000')
export const limitUser = parseInt(process.env['LIMIT_USER'] || '1000')

if (!key)
{
    console.error(`[ERROR] PRIVATE_KET is unset`)
    process.exit(1)
}

if (limitToken < 1)
{
    console.error(`[ERROR] LIMIT_TOKEN must more than zero`)
    process.exit(1)
}

if (limitUser < 1)
{
    console.error(`[ERROR] LIMIT_USER must more than zero`)
    process.exit(1)
}

console.log(`[INFO] LIMIT_TOKEN=${limitToken}`)
console.log(`[INFO] LIMIT_USER=${limitUser}`)
console.log(`[INFO] CLUSTERNAME=${clusterName}`)