---
title: Plugin API
description: API reference for creating and managing BeatAI plugins.
---

# Plugin API Reference

Complete reference for developing BeatAI plugins.

## Plugin Base Class

All plugins extend the base `Plugin` class.

### Class Definition

```javascript
import { Plugin } from 'loongbot';

export class MyPlugin extends Plugin {
  name = 'my-plugin';
  version = '1.0.0';
  description = 'My awesome plugin';
}
```

### Required Properties

#### name

Plugin unique identifier.

```javascript
name = 'weather-plugin'
```

**Type:** `string`
**Required:** Yes

### Optional Properties

#### version

Plugin version (semantic versioning).

```javascript
version = '1.0.0'
```

**Type:** `string`
**Default:** `'1.0.0'`

#### description

Human-readable description.

```javascript
description = 'Provides weather information'
```

**Type:** `string`

#### dependencies

Array of required plugin names.

```javascript
dependencies = ['logger', 'database']
```

**Type:** `Array<string>`

## Lifecycle Hooks

### onLoad()

Called when plugin is loaded.

```javascript
async onLoad() {
  console.log('Plugin loading...');
  this.api = await this.initializeAPI();
}
```

**Returns:** `Promise<void>`
**Called:** Once, during bot startup

### onMessage(message)

Called for each incoming message.

```javascript
async onMessage(message) {
  if (message.content.startsWith('/weather')) {
    const weather = await this.getWeather();
    await message.reply(weather);
  }
}
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| message | `Message` | Incoming message |

**Returns:** `Promise<void> | Promise<boolean>`
**Called:** For every message

Return `false` to stop message propagation:

```javascript
async onMessage(message) {
  if (message.content === '/stop') {
    return false; // Stop other plugins from processing
  }
}
```

### onEvent(event)

Called for custom events.

```javascript
async onEvent(event) {
  if (event.type === 'user_joined') {
    await this.welcomeUser(event.userId);
  }
}
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| event | `Object` | Event object |

**Returns:** `Promise<void>`

### onUnload()

Called before plugin is unloaded.

```javascript
async onUnload() {
  console.log('Cleaning up...');
  await this.db.close();
  this.cache.clear();
}
```

**Returns:** `Promise<void>`
**Called:** Once, during bot shutdown

## Plugin Context

Access bot functionality through `this`:

### this.bot

Reference to the BeatAI instance.

```javascript
async onLoad() {
  const botName = this.bot.config.name;
  console.log(`Loaded in ${botName}`);
}
```

### this.config

Plugin configuration object.

```javascript
async onLoad() {
  this.apiKey = this.config.get('apiKey');
  this.timeout = this.config.get('timeout', 5000); // with default
}
```

### this.logger

Built-in logger instance.

```javascript
this.logger.info('Plugin started');
this.logger.error('Something went wrong', { error });
this.logger.debug('Debug info', { data });
```

### this.emit(event, data)

Emit custom events.

```javascript
this.emit('weather:updated', {
  city: 'Tokyo',
  temperature: 25
});
```

### this.on(event, handler)

Listen to events from other plugins.

```javascript
this.on('database:connected', () => {
  console.log('Database ready!');
});
```

## Middleware Pattern

Implement middleware for message processing:

```javascript
export class MiddlewarePlugin extends Plugin {
  async onMessage(message, next) {
    // Before processing
    console.log('Before:', message.content);

    // Modify message
    message.content = message.content.trim();

    // Continue to next plugin
    const result = await next();

    // After processing
    console.log('After:', result);

    return result;
  }
}
```

## Storage API

Plugins have access to persistent storage:

### this.storage.set(key, value)

Store data.

```javascript
await this.storage.set('user:123', {
  name: 'John',
  preferences: { theme: 'dark' }
});
```

### this.storage.get(key)

Retrieve data.

```javascript
const user = await this.storage.get('user:123');
console.log(user.name); // "John"
```

### this.storage.delete(key)

Delete data.

```javascript
await this.storage.delete('user:123');
```

### this.storage.has(key)

Check if key exists.

```javascript
if (await this.storage.has('user:123')) {
  // User exists
}
```

## HTTP Client

Make HTTP requests:

### this.http.get(url, options)

```javascript
const response = await this.http.get('https://api.example.com/data', {
  headers: { 'Authorization': 'Bearer token' }
});
console.log(response.data);
```

### this.http.post(url, data, options)

```javascript
await this.http.post('https://api.example.com/data', {
  name: 'Test',
  value: 123
});
```

## Scheduling

Schedule tasks:

### this.schedule.every(interval, callback)

```javascript
async onLoad() {
  // Run every 5 minutes
  this.schedule.every('5 minutes', async () => {
    await this.checkWeather();
  });
}
```

### this.schedule.at(time, callback)

```javascript
this.schedule.at('09:00', async () => {
  await this.sendMorningReport();
});
```

### this.schedule.cron(expression, callback)

```javascript
this.schedule.cron('0 0 * * *', async () => {
  await this.dailyCleanup();
});
```

## Plugin Communication

### Broadcasting

```javascript
// Plugin A
this.emit('data:ready', { items: [] });

// Plugin B
this.on('data:ready', (data) => {
  console.log('Received:', data.items);
});
```

### Direct Communication

```javascript
const otherPlugin = this.bot.plugins.get('other-plugin');
if (otherPlugin) {
  await otherPlugin.doSomething();
}
```

## Error Handling

Handle errors gracefully:

```javascript
async onMessage(message) {
  try {
    const result = await this.riskyOperation();
    await message.reply(result);
  } catch (error) {
    this.logger.error('Operation failed', { error });
    await message.reply('Sorry, something went wrong.');

    // Optionally emit error event
    this.emit('error', error);
  }
}
```

## Testing Plugins

### Unit Testing

```javascript
import { test } from 'vitest';
import { MyPlugin } from './my-plugin.js';

test('plugin handles messages', async () => {
  const plugin = new MyPlugin({ apiKey: 'test' });

  await plugin.onLoad();

  const message = {
    content: '/command',
    reply: vi.fn()
  };

  await plugin.onMessage(message);

  expect(message.reply).toHaveBeenCalled();
});
```

### Integration Testing

```javascript
import { BeatAI } from 'loongbot';
import { MyPlugin } from './my-plugin.js';

test('plugin integrates with bot', async () => {
  const bot = new BeatAI({ test: true });
  bot.use(new MyPlugin());

  await bot.start();

  const response = await bot.sendTestMessage('/command');
  expect(response).toBeDefined();

  await bot.stop();
});
```

## Publishing

### package.json

```json
{
  "name": "loongbot-plugin-weather",
  "version": "1.0.0",
  "description": "Weather plugin for BeatAI",
  "main": "index.js",
  "keywords": ["loongbot", "plugin", "weather"],
  "peerDependencies": {
    "loongbot": "^1.0.0"
  },
  "files": ["index.js", "README.md"]
}
```

### README Template

```markdown
# loongbot-plugin-weather

Weather information plugin for BeatAI.

## Installation

\`\`\`bash
npm install loongbot-plugin-weather
\`\`\`

## Usage

\`\`\`javascript
import { WeatherPlugin } from 'loongbot-plugin-weather';

bot.use(new WeatherPlugin({
  apiKey: process.env.WEATHER_API_KEY
}));
\`\`\`

## Configuration

- `apiKey` (required): Weather API key
- `units` (optional): Temperature units (default: 'celsius')

## Commands

- `/weather [city]` - Get weather for a city

## License

MIT
```
