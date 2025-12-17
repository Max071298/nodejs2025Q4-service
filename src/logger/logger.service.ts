import { ConsoleLogger, Injectable } from '@nestjs/common';

type LogLevel = 'fatal' | 'error' | 'warn' | 'log' | 'debug' | 'verbose';

const LEVEL_PRIORITIES: Record<LogLevel, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  log: 3,
  verbose: 4,
  debug: 5,
};

@Injectable()
export class CustomLogger extends ConsoleLogger {
  log(message: any, context?: string) {
    // console.log(`[LOG] ${context ? `[${context}] ` : ''}${message}`);
  }

  error(message: any, stack?: string, context?: string) {}

  warn(message: any, context?: string) {}

  debug(message: any, context?: string) {}

  verbose(message: any, context?: string) {}
}
