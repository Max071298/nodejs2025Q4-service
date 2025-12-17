import { ConsoleLogger, Injectable } from '@nestjs/common';
import { createWriteStream, existsSync } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
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
  constructor(context?: string) {
    super(context);
  }

  async writeToFile(level: number, message: string, context: string) {
    const pathLog = path.join(__dirname, '..', '..', 'logs');

    await fs.mkdir(pathLog, { recursive: true });

    const filePath = path.join(pathLog, `${level}.${context}.log`);

    if (!existsSync(filePath)) {
      await fs.writeFile(filePath, '', 'utf8');
    }

    const writeStream = createWriteStream(filePath, { flags: 'a' });
    writeStream.write(`${new Date().toISOString()} - ${message}\n`);
    writeStream.end();
  }

  log(message: any, context?: string) {
    super.log(message, context);
    this.writeToFile(LEVEL_PRIORITIES['log'], message, context || 'log').catch(
      (e) => {
        console.error('Failed to write log to file', e);
      },
    );
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.writeToFile(
      LEVEL_PRIORITIES['error'],
      `${message} - ${stack || ''}`,
      context || 'error',
    ).catch((e) => {
      console.error('Failed to write log to file', e);
    });
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.writeToFile(
      LEVEL_PRIORITIES['warn'],
      message,
      context || 'warn',
    ).catch(() => {});
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    this.writeToFile(
      LEVEL_PRIORITIES['debug'],
      message,
      context || 'debug',
    ).catch(() => {});
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
    this.writeToFile(
      LEVEL_PRIORITIES['verbose'],
      message,
      context || 'verbose',
    ).catch(() => {});
  }
}
