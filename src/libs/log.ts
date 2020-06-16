import {createLogger, format, transports} from 'winston'

const log = createLogger({
    defaultMeta: 'notification-centre',
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