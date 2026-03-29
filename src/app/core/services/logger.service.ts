import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  None = 4
}

export interface ErrorEntry {
  timestamp: Date;
  level: 'error' | 'warn';
  message: string;
  data?: unknown;
}

const ERROR_BUFFER_MAX = 50;

/**
 * Logger Service
 * Provides safe logging that respects environment configuration
 * In production, logs are disabled by default
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: LogLevel = environment.production ? LogLevel.Error : LogLevel.Debug;
  private errorBuffer: ErrorEntry[] = [];

  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.Debug, message, args);
  }

  info(message: string, ...args: any[]): void {
    this.log(LogLevel.Info, message, args);
  }

  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.Warn, message, args);

    if (environment.production && environment.enableCrashReporting) {
      this.reportError(message, args.length === 1 ? args[0] : args.length > 1 ? args : undefined, 'warn');
    }
  }

  error(message: string, error?: any, ...args: any[]): void {
    this.log(LogLevel.Error, message, [error, ...args]);

    // In production, you could send errors to a monitoring service
    // Example: Sentry, LogRocket, Firebase Crashlytics, etc.
    if (environment.production && environment.enableCrashReporting) {
      this.reportError(message, error, 'error');
    }
  }

  private log(level: LogLevel, message: string, args: any[]): void {
    if (level < this.logLevel) {
      return;
    }

    if (!environment.enableConsoleLog && environment.production) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${LogLevel[level]}] ${timestamp}`;

    switch (level) {
      case LogLevel.Debug:
        console.debug(prefix, message, ...args);
        break;
      case LogLevel.Info:
        console.info(prefix, message, ...args);
        break;
      case LogLevel.Warn:
        console.warn(prefix, message, ...args);
        break;
      case LogLevel.Error:
        console.error(prefix, message, ...args);
        break;
    }
  }

  private reportError(message: string, data: unknown, level: 'error' | 'warn'): void {
    const entry: ErrorEntry = {
      timestamp: new Date(),
      level,
      message,
      ...(data !== undefined && { data })
    };

    this.errorBuffer.push(entry);

    if (this.errorBuffer.length > ERROR_BUFFER_MAX) {
      this.errorBuffer.shift();
    }

    // Future integration point: forward `entry` to Sentry, Firebase Crashlytics,
    // or a custom API endpoint here without changing the callers.
  }

  getErrorBuffer(): ErrorEntry[] {
    return [...this.errorBuffer];
  }

  clearErrorBuffer(): void {
    this.errorBuffer = [];
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}
