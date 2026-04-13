import Winston from 'winston';

class Logger {
    protected readonly directoryPath: string = 'logs';
    protected readonly errorLogger: Winston.Logger = Winston.createLogger({
        level: 'error',
        format: Winston.format.combine(
            Winston.format.timestamp(),
            Winston.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })
        ),
        transports: [
            new Winston.transports.Console(),
            new Winston.transports.File({ filename: 'error.log', dirname: this.directoryPath }),
        ],
    });
    protected readonly warnLogger: Winston.Logger = Winston.createLogger({
        level: 'warn',
        format: Winston.format.combine(
            Winston.format.timestamp(),
            Winston.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })
        ),
        transports: [
            new Winston.transports.Console(),
            new Winston.transports.File({ filename: 'warn.log', dirname: this.directoryPath }),
        ],
    });
    protected readonly infoLogger: Winston.Logger = Winston.createLogger({
        level: 'info',
        format: Winston.format.combine(
            Winston.format.timestamp(),
            Winston.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })
        ),
        transports: [
            new Winston.transports.Console(),
            new Winston.transports.File({ filename: 'info.log', dirname: this.directoryPath }),
        ],
    });
    constructor(directoryPath?: string) {
        if (directoryPath) {
            this.directoryPath = directoryPath;
        }
    }

    public error(message: string) {
        this.errorLogger.error(message);
    }

    public warn(message: string) {
        this.warnLogger.warn(message);
    }

    public info(message: string) {
        this.infoLogger.info(message);
    }
};

export default Logger;