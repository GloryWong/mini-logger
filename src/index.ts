import debug from 'debug';

const configs = [
  {
    type: 'error',
    consoleMethod: console.error,
    color: '#DC143C',
  },
  {
    type: 'warn',
    consoleMethod: console.warn,
    color: '#FFA500',
  },
  {
    type: 'info',
    consoleMethod: console.info,
    color: '#1E90FF',
  },
  {
    type: 'success',
    consoleMethod: console.log,
    color: '#32CD32',
  },
  {
    type: 'debug',
    consoleMethod: console.debug,
    color: 'gray',
  },
];

function createInternalLogger(
  namespace: string,
  type: string,
  consoleMethod: (...args: any[]) => any,
  color: string,
) {
  const logger = debug(`${namespace}:${type}`);
  logger.log = consoleMethod.bind(console);
  logger.color = color;
  return logger;
}

function createLoggerMethods(namespace: string) {
  return configs.map(
    ({ type, consoleMethod, color }) =>
      (title: string, formatter: any, ...args: any[]) => {
        const logger = createInternalLogger(
          namespace,
          type,
          consoleMethod,
          color,
        );
        logger(`[${title}] ${formatter}`, ...args);
      },
  );
}

export type LoggerMethod = ReturnType<typeof createLoggerMethods>[0];

export interface Logger {
  (title: string, formatter: any, ...args: any[]): void;
  info: LoggerMethod;
  warn: LoggerMethod;
  success: LoggerMethod;
  error: LoggerMethod;
  debug: LoggerMethod;
}

function createLogger(namespace: string) {
  const [info, warn, error, success, debug] = createLoggerMethods(
    namespace.trim(),
  );
  const logger: Logger = (...args: Parameters<LoggerMethod>) => info(...args);

  logger.info = info;
  logger.warn = warn;
  logger.success = success;
  logger.error = error;
  logger.debug = debug;

  return logger;
}

export { createLogger };
