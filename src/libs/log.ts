import {createLogger, format, transports} from 'winston'
import os from 'os'
const log = createLogger({
    defaultMeta: {
        app: 'notification-centre',
        hostname: os.hostname(),
    },
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console()
    ]
})

export default log