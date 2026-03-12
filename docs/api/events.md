---
title: Events API
description: Complete reference for BeatAI's event system and event-driven architecture.
---

# Events API Reference

BeatAI uses an event-driven architecture. This guide documents all built-in events and how to create custom events.

## Built-in Events

### Message Events

#### message

Fired when a new message is received.

```javascript
bot.on('message', async (message) => {
  console.log(`From ${message.userId}: ${message.content}`);
});
```

**Payload:**

```typescript
{
  id: string;
  content: string;
  userId: string;
  timestamp: Date;
  platform: string;
  metadata: Record<string, any>;
}
```

#### message:sent

Fired after a message is successfully sent.

```javascript
bot.on('message:sent', (message) => {
  console.log('Message sent:', message.id);
});
```

#### message:failed

Fired when message sending fails.

```javascript
bot.on('message:failed', ({ message, error }) => {
  console.error('Failed to send:', error);
});
```

### Lifecycle Events

#### ready

Fired when the bot is fully initialized and ready.

```javascript
bot.on('ready', () => {
  console.log('Bot is ready!');
});
```

#### start

Fired when bot starts.

```javascript
bot.on('start', () => {
  console.log('Bot starting...');
});
```

#### stop

Fired when bot stops.

```javascript
bot.on('stop', () => {
  console.log('Bot stopping...');
});
```

#### error

Fired when an error occurs.

```javascript
bot.on('error', (error) => {
  console.error('Bot error:', error);
  // Send alert, log to external service, etc.
});
```

### Plugin Events

#### plugin:loaded

Fired when a plugin is loaded.

```javascript
bot.on('plugin:loaded', (plugin) => {
  console.log(`Plugin ${plugin.name} loaded`);
});
```

#### plugin:unloaded

Fired when a plugin is unloaded.

```javascript
bot.on('plugin:unloaded', (plugin) => {
  console.log(`Plugin ${plugin.name} unloaded`);
});
```

#### plugin:error

Fired when a plugin encounters an error.

```javascript
bot.on('plugin:error', ({ plugin, error }) => {
  console.error(`Plugin ${plugin.name} error:`, error);
});
```

### User Events

#### user:joined

Fired when a new user starts interacting with the bot.

```javascript
bot.on('user:joined', async (user) => {
  await bot.sendMessage(user.id, 'Welcome!');
});
```

**Payload:**

```typescript
{
  id: string;
  name?: string;
  platform: string;
  metadata: Record<string, any>;
}
```

#### user:left

Fired when a user stops interacting with the bot.

```javascript
bot.on('user:left', (user) => {
  console.log(`User ${user.id} left`);
});
```

### AI Events

#### ai:request

Fired before an AI request is made.

```javascript
bot.on('ai:request', ({ prompt, options }) => {
  console.log('AI request:', prompt);
});
```

#### ai:response

Fired after receiving an AI response.

```javascript
bot.on('ai:response', ({ prompt, response, duration }) => {
  console.log(`AI responded in ${duration}ms`);
});
```

#### ai:error

Fired when an AI request fails.

```javascript
bot.on('ai:error', ({ error, prompt }) => {
  console.error('AI error:', error);
});
```

## Event Methods

### on(event, handler)

Register an event listener.

```javascript
bot.on('message', async (message) => {
  // Handle message
});
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| event | `string` | Event name |
| handler | `Function` | Event handler |

**Returns:** `BeatAI` (chainable)

### once(event, handler)

Register a one-time event listener.

```javascript
bot.once('ready', () => {
  console.log('Bot ready for the first time!');
});
```

### off(event, handler)

Remove an event listener.

```javascript
const handler = (message) => console.log(message);

bot.on('message', handler);
// Later...
bot.off('message', handler);
```

### emit(event, data)

Emit a custom event.

```javascript
bot.emit('custom:event', {
  data: 'some data',
  timestamp: Date.now()
});
```

### removeAllListeners(event)

Remove all listeners for an event.

```javascript
bot.removeAllListeners('message');
```

## Custom Events

### Creating Custom Events

Plugins can emit custom events:

```javascript
export class WeatherPlugin extends Plugin {
  async checkWeather(city) {
    const weather = await this.fetchWeather(city);

    // Emit custom event
    this.emit('weather:checked', {
      city,
      weather,
      timestamp: Date.now()
    });

    return weather;
  }
}
```

### Listening to Custom Events

```javascript
bot.on('weather:checked', ({ city, weather }) => {
  console.log(`Weather in ${city}: ${weather.temp}°C`);
});
```

### Event Namespacing

Use colons for event namespacing:

```javascript
// Good
'plugin:loaded'
'user:joined'
'message:sent'
'database:connected'

// Also good
'weather:updated'
'analytics:tracked'
'cache:cleared'
```

## Event Priority

Control event handler execution order:

```javascript
bot.on('message', handler1, { priority: 10 });
bot.on('message', handler2, { priority: 5 });
bot.on('message', handler3, { priority: 1 });

// Execution order: handler1, handler2, handler3
```

## Async Event Handlers

All event handlers can be async:

```javascript
bot.on('message', async (message) => {
  const user = await db.getUser(message.userId);
  const response = await bot.ai.chat(message.content);
  await message.reply(response);
});
```

### Sequential vs Parallel

By default, handlers run sequentially:

```javascript
// These run one after another
bot.on('message', async (msg) => await handler1(msg));
bot.on('message', async (msg) => await handler2(msg));
```

For parallel execution:

```javascript
bot.on('message', (message) => {
  Promise.all([
    handler1(message),
    handler2(message)
  ]);
});
```

## Error Handling in Events

### Try-Catch Pattern

```javascript
bot.on('message', async (message) => {
  try {
    await riskyOperation(message);
  } catch (error) {
    console.error('Handler error:', error);
    await message.reply('Sorry, something went wrong.');
  }
});
```

### Global Error Handler

```javascript
bot.on('error', (error) => {
  // Log to external service
  logger.error(error);

  // Send alert
  if (error.severity === 'critical') {
    alertService.send('Critical bot error', error);
  }
});
```

## Event Filtering

Filter events based on conditions:

```javascript
bot.on('message', async (message) => {
  // Only handle messages from specific platform
  if (message.platform !== 'telegram') return;

  // Only handle commands
  if (!message.content.startsWith('/')) return;

  // Handle the command
  await handleCommand(message);
});
```

## Event Wildcards

Listen to multiple related events:

```javascript
bot.on('plugin:*', (event) => {
  console.log('Plugin event:', event.type);
});

bot.on('user:*', (event) => {
  console.log('User event:', event.type);
});
```

## Event Payload Validation

Validate event payloads:

```javascript
import Joi from 'joi';

const messageSchema = Joi.object({
  id: Joi.string().required(),
  content: Joi.string().required(),
  userId: Joi.string().required()
});

bot.on('message', async (message) => {
  const { error } = messageSchema.validate(message);
  if (error) {
    console.error('Invalid message:', error);
    return;
  }

  // Process valid message
  await handleMessage(message);
});
```

## Event Debugging

Enable event debugging:

```javascript
bot.on('*', (event) => {
  console.debug('Event:', event.type, event.data);
});
```

Or use the built-in debug mode:

```javascript
const bot = new BeatAI({
  debug: {
    events: true
  }
});
```

## Performance Considerations

### Avoid Heavy Operations

```javascript
// Bad: Blocking operation
bot.on('message', (message) => {
  const result = expensiveSync Operation(message);
});

// Good: Async operation
bot.on('message', async (message) => {
  const result = await expensiveAsyncOperation(message);
});
```

### Debouncing Events

```javascript
import { debounce } from 'lodash';

const debouncedHandler = debounce(async (message) => {
  await handleMessage(message);
}, 1000);

bot.on('message', debouncedHandler);
```

### Event Throttling

```javascript
import { throttle } from 'lodash';

const throttledHandler = throttle(async (message) => {
  await handleMessage(message);
}, 1000);

bot.on('message', throttledHandler);
```

## Best Practices

1. **Use descriptive event names** with namespacing
2. **Handle errors** in event handlers
3. **Avoid memory leaks** by removing listeners when done
4. **Document custom events** in your plugin
5. **Keep handlers focused** on a single responsibility
6. **Use async/await** for asynchronous operations
7. **Consider performance** for high-frequency events
