/**
 * Log
 */
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

export interface ILogLevels {
  info: ILogMethod;
  warn: ILogMethod;
  error: ILogMethod;
}

export interface ILog extends ILogColors, ILogLevels {
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
