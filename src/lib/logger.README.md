# Logger Service Documentation

A centralized logging service for structured, environment-aware logging throughout the application.

## Features

- **Environment-aware**: Verbose in development, minimal in production
- **Structured logging**: All logs include context objects
- **Log levels**: DEBUG, INFO, WARN, ERROR
- **Performance tracking**: Built-in performance monitoring
- **Log storage**: Keeps recent logs in memory for debugging
- **Remote logging**: Optional integration with logging services (Sentry, LogRocket, etc.)

## Quick Start

```typescript
import { log } from '@/lib/logger';

// Basic logging
log.debug('Debug message', { userId: '123' });
log.info('User logged in', { userId: '123', timestamp: Date.now() });
log.warn('API rate limit approaching', { remaining: 10 });
log.error('Failed to save data', error, { userId: '123', action: 'save' });

// Specialized logging
log.action('button_clicked', { buttonId: 'submit', page: '/checkout' });
log.api('POST', '/api/users', { userId: '123' });
log.navigation('/home', '/dashboard');
log.performance('api_call', 245.67, { endpoint: '/api/users' });
```

## Log Levels

### DEBUG (Level 0)
- Only shown in development
- Use for detailed debugging information
- Example: Function calls, data transformations

```typescript
log.debug('Fetching user data', { userId: '123', filters: {...} });
```

### INFO (Level 1)
- Informational messages
- User actions, successful operations
- Example: User logged in, email sent

```typescript
log.info('Email sent successfully', { 
  to: 'user@example.com',
  subject: 'Welcome',
  templateId: 'welcome-v1'
});
```

### WARN (Level 2)
- Warning messages
- Recoverable errors, deprecated features
- Logged to remote service in production

```typescript
log.warn('API rate limit approaching', { 
  remaining: 10,
  resetAt: '2024-01-01T12:00:00Z'
});
```

### ERROR (Level 3)
- Error messages
- Unrecoverable errors, exceptions
- Always logged to remote service

```typescript
try {
  await saveUser(data);
} catch (error) {
  log.error('Failed to save user', error as Error, {
    userId: data.id,
    action: 'save',
  });
}
```

## Performance Tracking

### Manual Timing
```typescript
import { createTimer } from '@/lib/logger';

const timer = createTimer('database_query');
const results = await db.query('SELECT * FROM users');
timer.end({ resultCount: results.length });
```

### Using the Decorator (for class methods)
```typescript
import { trackPerformance } from '@/lib/logger';

class UserService {
  @trackPerformance('UserService.getUser')
  async getUser(id: string) {
    return await db.users.findById(id);
  }
}
```

## Specialized Logging

### User Actions
Track user interactions and behavior:
```typescript
log.action('form_submitted', {
  formId: 'contact-form',
  page: '/contact',
  fields: ['name', 'email', 'message']
});
```

### API Calls
Track API requests for debugging:
```typescript
log.api('POST', '/api/candidates', {
  payload: { name: 'John Doe' },
  headers: { 'Content-Type': 'application/json' }
});
```

### Navigation
Track route changes:
```typescript
log.navigation('/candidates', '/candidates/123');
```

## Accessing Logs

### In Development
Logs are automatically printed to the browser console with color coding.

### Log Viewer (Admin Only)
Access the log viewer in Admin Settings (development mode only):
- Click "View Logs" button in Admin Settings
- Filter by log level
- Export logs as JSON
- Clear logs

### Programmatic Access
```typescript
import { logger } from '@/lib/logger';

// Get recent logs
const recentLogs = logger.getRecentLogs(50);

// Export all logs
const logsJson = logger.exportLogs();

// Clear logs
logger.clearLogs();
```

## Production Configuration

### Remote Logging Integration
Update the `sendToRemote` method in `src/lib/logger.ts`:

```typescript
private async sendToRemote(entry: LogEntry): Promise<void> {
  if (!this.isDevelopment && entry.level >= LogLevel.WARN) {
    try {
      // Example: Sentry
      Sentry.captureException(entry);
      
      // Example: Custom API
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (err) {
      // Silently fail to avoid infinite loops
    }
  }
}
```

## Best Practices

### ✅ Do
- Include relevant context with every log
- Use appropriate log levels
- Log user actions for analytics
- Track performance of critical operations
- Include error objects when logging errors

```typescript
// Good
log.error('Payment failed', error, {
  userId: user.id,
  amount: payment.amount,
  currency: payment.currency,
  gateway: 'stripe'
});
```

### ❌ Don't
- Log sensitive data (passwords, credit cards, tokens)
- Use console.log directly
- Log in tight loops (use sparingly)
- Include large objects in context

```typescript
// Bad - includes sensitive data
log.info('User logged in', { 
  password: user.password  // ❌ Never log passwords
});

// Bad - logs in tight loop
data.forEach(item => {
  log.debug('Processing item', item);  // ❌ Too much logging
});
```

## Migration from console.log

Replace existing console statements:

```typescript
// Before
console.log('User created:', user);
console.error('Failed to save:', error);
console.warn('Deprecated API used');

// After
log.info('User created', { userId: user.id, email: user.email });
log.error('Failed to save user', error, { userId: user.id });
log.warn('Deprecated API used', { endpoint: '/api/old', alternative: '/api/v2' });
```

## Environment Variables

Configure log behavior with environment variables (future enhancement):

```env
# Minimum log level (DEBUG, INFO, WARN, ERROR)
VITE_LOG_LEVEL=INFO

# Enable remote logging
VITE_REMOTE_LOGGING=true

# Remote logging endpoint
VITE_LOG_ENDPOINT=https://api.example.com/logs
```

## Examples in Codebase

See these files for implementation examples:
- `src/lib/emailNotificationService.ts` - Email logging
- `src/lib/feedbackRequestService.ts` - Request tracking
- `src/lib/integrations/atsIntegrationService.ts` - API logging
- `src/components/common/ErrorBoundary.tsx` - Error logging
