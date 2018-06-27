import * as nodeUtil from 'util';
import { R, chalk } from './common';
import { ILoggable, ILog, ILogLevels, ILogTableOptions } from './types';
import { table } from './log.table';

export * from './types';

export const COLORS = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
];

export const METHODS = ['info', 'warn', 'error'];

const format = (level: string, items: ILoggable[]) => {
  const levelColor = (item: any) => {
    switch (level) {
      case 'warn':
        return chalk.yellow(item);
      case 'error':
        return chalk.red(item);
      default:
        return item;
    }
  };

  // Convert objects to JSON.
  items = items.map(item => {
    if (item instanceof Error) {
      return item.stack;
    }
    if (R.is(Object, item)) {
      // Object formatted with colors (JSON).
      return nodeUtil.inspect(item, false, undefined, true);
    }
    return item;
  });

  // Convert to final string.
  const output = items.join(' ');

  // Perform level specific transformations.

  // Finish up.
  return levelColor(output);
};

const logger = (level: string, color: string, items: ILoggable[]) => {
  if (log.silent) {
    return; // Logging suppressed.
  }
  let message = format(level, items);
  if (color !== 'black') {
    message = chalk[color](message);
  }
  console.log(message); // tslint:disable-line
};
const clear = () => console.clear(); // tslint:disable-line

const info: any = (...items: ILoggable[]) => logger('info', 'black', items);
const warn: any = (...items: ILoggable[]) => logger('warn', 'black', items);
const error: any = (...items: ILoggable[]) => logger('error', 'black', items);

const levelsLog: ILogLevels = {
  info,
  warn,
  error,
};

export const log: ILog = {
  ...levelsLog,
  silent: false,
  clear,
  table: (options?: ILogTableOptions) => table(levelsLog, options),
} as any;

// Apply colors to each method.
const applyMethodColors = (level: string, obj: any) => {
  COLORS.forEach(color => {
    obj[color] = (...items: ILoggable[]) => logger(level, color, items);
  });
};
METHODS.forEach(level => applyMethodColors(level, log[level]));

// Attach color helpers to the log.
COLORS.forEach(color => {
  log[color] = chalk[color];
});

export default log;
