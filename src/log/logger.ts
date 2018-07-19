import * as nodeUtil from 'util';
import { R, chalk, Subject } from '../common';
import { ILoggable, LogLevel, LogEvent, Logger } from '../types';
import { share } from 'rxjs/operators';

/**
 * Creates a [Logger] instance.
 */
export function createLogger(): Logger {
  const events$ = new Subject<LogEvent>();
  return {
    events$: events$.pipe(share()),
    next(level: LogLevel, color: string, items: ILoggable[]) {
      const output = format(level, color, items);
      events$.next({
        level,
        color,
        items,
        output,
      });
      return output;
    },
  };
}

/**
 * INTERNAL
 */
function format(level: LogLevel, color: string, items: ILoggable[]) {
  // Convert objects to JSON.
  items = items.map(item => {
    if (item instanceof Error) {
      return item.stack;
    }

    // Object formatted with colors (JSON).
    if (R.is(Object, item)) {
      return nodeUtil.inspect(item, false, undefined, true);
    }

    return item;
  });

  // Convert to final string.
  let output = items.join(' ');
  output = levelColor(level, output);
  output = color === 'black' ? output : chalk[color](output);

  // Finish up.
  return output;
}

function levelColor(level: LogLevel, item: any): string {
  switch (level) {
    case 'warn':
      return chalk.yellow(item);
    case 'error':
      return chalk.red(item);
    default:
      return item;
  }
}
