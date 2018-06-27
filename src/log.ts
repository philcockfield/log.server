import { R, yaml, chalk } from './common';

export type ILoggable = any;
export type ILogger = (...items: ILoggable[]) => string;

export interface ILogColors {
  black: ILogger;
  red: ILogger;
  green: ILogger;
  yellow: ILogger;
  blue: ILogger;
  magenta: ILogger;
  cyan: ILogger;
  white: ILogger;
  gray: ILogger;
}

export interface ILogMethod extends ILogColors, ILogger {}

export interface ILog extends ILogColors {
  silent: boolean;
  info: ILogMethod;
  warn: ILogMethod;
  error: ILogMethod;
  clear: () => void;
}

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
  // Convert objects to JSON.
  items = items.map(item => {
    if (item instanceof Error) {
      return item.stack;
    }
    if (R.is(Object, item)) {
      // Convert object to YAML string
      // (NB: easy to read, and protects against circular reference).
      const obj = yaml
        .safeDump(item, { indent: 2 })
        .split('\n')
        .map(line => `  ${line}`)
        .join('\n');
      return `\n${obj}`;
    }
    return item;
  });

  // Convert to final string.
  let output = items.join(' ');

  // Perform level specific transformations.
  switch (level) {
    case 'warn':
      output = chalk.yellow(output);
      break;
    case 'error':
      output = chalk.red(output);
      break;
    default:
  }

  // Finish up.
  return output;
};

const logger = (level: string, color: string, items: ILoggable[]) => {
  if (log.silent) {
    return;
  } // Logging suppressed.
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

export const log: ILog = {
  silent: false,
  info,
  warn,
  error,
  clear,
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
