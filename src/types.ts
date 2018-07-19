import { Observable } from './common';

/**
 * Log
 */
export type ILoggable = any;
export type ILogger = (...items: ILoggable[]) => string;

export type LogEvent = {
  items: ILoggable[];
  level: LogLevel;
  color: string;
  output: string;
};

export type Logger = {
  next: (level: LogLevel, color: string, items: ILoggable[]) => string;
  events$: Observable<LogEvent>;
};

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

export interface ILogLevels {
  info: ILogMethod;
  warn: ILogMethod;
  error: ILogMethod;
}

export type LogLevel = 'info' | 'warn' | 'error';

export interface ILog extends ILogColors, ILogLevels {
  events$: Observable<LogEvent>;
  silent: boolean;
  clear: () => void;
  table(options?: ILogTableOptions): ILogTable;
}

/**
 * Table
 */
export interface ILogTableOptions {
  head?: Array<string | number | undefined>;
  colWidths?: number[];
}

export interface ILogTable {
  add: (columns: Array<string | number | undefined>) => ILogTable;
  log: () => ILogTable;
  toString: () => string;
}
