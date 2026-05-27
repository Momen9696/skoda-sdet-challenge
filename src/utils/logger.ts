type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel =
  process.env.LOG_LEVEL === 'debug' ? 'debug' : process.env.CI ? 'info' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] >= levelPriority[currentLevel];
}

export const logger = {
  debug: (message: string, meta?: unknown): void => {
    if (shouldLog('debug')) console.debug(`[DEBUG] ${message}`, meta ?? '');
  },
  info: (message: string, meta?: unknown): void => {
    if (shouldLog('info')) console.info(`[INFO] ${message}`, meta ?? '');
  },
  warn: (message: string, meta?: unknown): void => {
    if (shouldLog('warn')) console.warn(`[WARN] ${message}`, meta ?? '');
  },
  error: (message: string, meta?: unknown): void => {
    if (shouldLog('error')) console.error(`[ERROR] ${message}`, meta ?? '');
  },
};
