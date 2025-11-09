/**
 * Centralized Logging Service
 * 
 * Features:
 * - Environment-aware (verbose in dev, minimal in production)
 * - Structured logging with context
 * - Log levels: debug, info, warn, error
 * - Optional remote logging for production
 * - Performance tracking
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  stack?: string;
}

class Logger {
  private minLevel: LogLevel;
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${levelNames[level]}] ${message}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      stack: error?.stack,
    };
  }

  private storeLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    // Only send errors and warnings to remote in production
    if (!this.isDevelopment && entry.level >= LogLevel.WARN) {
      try {
        // TODO: Integrate with your logging service (e.g., Sentry, LogRocket, CloudWatch)
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(entry),
        // });
      } catch (err) {
        // Silently fail - don't create infinite loop
      }
    }
  }

  /**
   * Debug level logging - only in development
   */
  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.storeLog(entry);

    if (this.isDevelopment) {
      console.log(
        `%c${this.formatMessage(LogLevel.DEBUG, message)}`,
        'color: #888',
        context || ''
      );
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.storeLog(entry);

    if (this.isDevelopment) {
      console.log(
        `%c${this.formatMessage(LogLevel.INFO, message)}`,
        'color: #2196F3',
        context || ''
      );
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    this.storeLog(entry);
    this.sendToRemote(entry);

    console.warn(this.formatMessage(LogLevel.WARN, message), context || '');
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.storeLog(entry);
    this.sendToRemote(entry);

    console.error(
      this.formatMessage(LogLevel.ERROR, message),
      error || '',
      context || ''
    );
  }

  /**
   * Track performance metrics
   */
  performance(label: string, duration: number, context?: LogContext): void {
    this.debug(`⏱️ ${label}: ${duration.toFixed(2)}ms`, context);
  }

  /**
   * Track user actions
   */
  action(actionName: string, context?: LogContext): void {
    this.info(`🎯 User action: ${actionName}`, context);
  }

  /**
   * Track API calls
   */
  api(method: string, endpoint: string, context?: LogContext): void {
    this.debug(`🌐 API ${method} ${endpoint}`, context);
  }

  /**
   * Track navigation
   */
  navigation(from: string, to: string): void {
    this.debug(`📍 Navigation: ${from} → ${to}`);
  }

  /**
   * Get recent logs (for debugging)
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs for download
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Create singleton instance
export const logger = new Logger();

// Convenience functions
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: LogContext) => 
    logger.error(message, error, context),
  performance: (label: string, duration: number, context?: LogContext) =>
    logger.performance(label, duration, context),
  action: (actionName: string, context?: LogContext) => logger.action(actionName, context),
  api: (method: string, endpoint: string, context?: LogContext) =>
    logger.api(method, endpoint, context),
  navigation: (from: string, to: string) => logger.navigation(from, to),
};

/**
 * Performance tracking decorator
 */
export function trackPerformance(label: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = performance.now() - start;
        logger.performance(label, duration);
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        logger.performance(`${label} (failed)`, duration);
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Create a timer for tracking operations
 */
export function createTimer(label: string) {
  const start = performance.now();
  return {
    end: (context?: LogContext) => {
      const duration = performance.now() - start;
      logger.performance(label, duration, context);
      return duration;
    },
  };
}
