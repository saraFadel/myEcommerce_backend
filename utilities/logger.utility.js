const {createLogger, format, transports} = require('winston');

exports.logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({format: 'DD-MM-YYYY HH:mm:ss'}),
        format.errors({stack: true}),
        format.printf(({timestamp, level, message, stack}) => {
            return `${timestamp}  |  ${level.toUpperCase()}  |  ${message}  | ${stack? `\n${stack}` : ''}`
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: 'logs/combined.log'}),
        new transports.File({filename: 'logs/error.log', level: 'error'})
    ]
});