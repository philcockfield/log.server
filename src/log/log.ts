import { chalk, constants } from '../common';
import {
  ILoggable,
  ILog,
  ILogLevels,
  ILogTableOptions,
  LogLevel,
} from '../types';
import { table } from './log.table';
import { createLogger } from './logger';

import { filter } from 'rxjs/operators';

const { METHODS, COLORS } = constants;

/**
 * Default logger than write to the console.
 */
const logger = createLogger();
logger.events$.pipe(filter(e => !log.silent)).subscribe(e => {
  console.log(e.output); // tslint:disable-line
});

const clear = () => console.clear(); // tslint:disable-line
const info: any = (...items: ILoggable[]) =>
  logger.next('info', 'black', items);
const warn: any = (...items: ILoggable[]) =>
  logger.next('warn', 'black', items);
const error: any = (...items: ILoggable[]) =>
  logger.next('error', 'black', items);

const levelsLog: ILogLevels = {
  info,
  warn,
  error,
};

export const log: ILog = {
  silent: false,
  events$: logger.events$,
  info: levelsLog.info,
  warn: levelsLog.warn,
  error: levelsLog.error,
  clear,
  table: (options?: ILogTableOptions) => table(levelsLog, options),
} as any;

/**
 * INTERNAL: Assign color/method variants to the API.
 */
const applyMethodColors = (level: LogLevel, obj: any) => {
  const method = (color: string) => (...items: ILoggable[]) =>
    logger.next(level, color, items);
  COLORS.forEach(color => (obj[color] = method(color)));
};
METHODS.forEach((level: LogLevel) => applyMethodColors(level, log[level]));
COLORS.forEach(color => (log[color] = chalk[color]));
