/* tslint:disable:no-console */
import * as chalk from 'chalk';
import * as yaml from 'js-yaml';
import * as R from 'ramda';


export interface ILog {
  silent: boolean;
  info: any;
  warn: any;
  error: any;
  black?: Function;
  red?: Function;
  green?: Function;
  yellow?: Function;
  blue?: Function;
  magenta?: Function;
  cyan?: Function;
  white?: Function;
  gray?: Function;

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

export const METHODS = [
  'info',
  'warn',
  'error',
];




const format = (level, items) => {
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
        .split('\n').map(line => `  ${ line }`)
        .join('\n');
      return `\n${ obj }`;
    }
    return item;
  });

  // Convert to final string.
  let output = items.join(' ');

  // Perform level specific transformations.
  switch (level) {
    // Turn errors to red text.
    case 'error': output = chalk.red(output); break;
    default:
  }

  // Finish up.
  return output;
};



const logger: any = (level: string, color: string, items: Array<any>) => {
  if (log.silent) { return; } // Logging suppressed.
  let message = format(level, items);
  if (color !== 'black') {
    message = chalk[color](message);
  }
  console.log(message);
};
const info: any = (...items) => logger('info', 'black', items);
const warn: any = (...items) => logger('warn', 'black', items);
const error: any = (...items) => logger('error', 'black', items);



export const log: ILog = {
  silent: false,
  info,
  warn,
  error,
};


// Apply colors to each method.
const applyMethodColors = (level, obj) => {
  COLORS.forEach(color => {
    obj[color] = (...items) => logger(level, color, items);
  });

};
METHODS.forEach(level => applyMethodColors(level, log[level]));

// Attach color helpers to the log.
COLORS.forEach(color => {
  log[color] = chalk[color];
});




export default log;
