---
title: Plugin Development
description: Learn how to create powerful plugins to extend BeatAI's functionality.
---

# Plugin Development

Plugins are the core extensibility mechanism in BeatAI. This guide teaches you how to create your own plugins.

## Plugin Architecture

Every plugin extends the base `Plugin` class and implements lifecycle hooks:

```javascript
import { Plugin } from 'loongbot';

export class MyPlugin extends Plugin {
  name = 'my-plugin';
  version = '1.0.0';

  async onLoad() {
    // Called when plugin is loaded
    console.log('Plugin loaded!');
  }

  async onMessage(message) {
    // Called for every message
    if (message.content.includes('hello')) {
      await message.reply('Hello from plugin!');
    }
  }

  async onUnload() {
    // Cleanup when plugin is unloaded
    console.log('Plugin unloaded');
  }
}
```

## Creating Your First Plugin

### 1. Setup Plugin Project

```bash
mkdir my-plugin
cd my-plugin
npm init -y
npm install loongbot
```

### 2. Create Plugin File

Create `index.js`:

```javascript
import { Plugin } from 'loongbot';

export class WeatherPlugin extends Plugin {
  name = 'weather';
  description = 'Provides weather information';

  async onLoad() {
    this.apiKey = this.config.get('apiKey');
  }

  async onMessage(message) {
    if (message.content.startsWith('/weather')) {
      const city = message.content.split(' ')[1];
      const weather = await this.getWeather(city);
      await message.reply(`Weather in ${city}: ${weather}`);
    }
  }

  async getWeather(city) {
    const response = await fetch(
      `https://api.weather.com/v1/${city}?key=${this.apiKey}`
    );
    return response.json();
  }
}
```

### 3. Use the Plugin

```javascript
import { BeatAI } from 'loongbot';
import { WeatherPlugin } from './my-plugin/index.js';

const bot = new BeatAI();

bot.use(new WeatherPlugin({
  apiKey: process.env.WEATHER_API_KEY
}));

bot.start();
```

## Plugin Lifecycle Hooks

### onLoad()

Called when the plugin is first loaded:

```javascript
async onLoad() {
  // Initialize resources
  this.db = await this.connectDatabase();
  this.cache = new Map();
}
```

### onMessage(message)

Called for every incoming message:

```javascript
async onMessage(message) {
  // Process message
  const processed = await this.process(message);
  return processed;
}
```

### onEvent(event)

Called for custom events:

```javascript
async onEvent(event) {
  if (event.type === 'user_joined') {
    await this.welcomeUser(event.user);
  }
}
```

### onUnload()

Called before plugin is unloaded:

```javascript
async onUnload() {
  // Cleanup
  await this.db.close();
  this.cache.clear();
}
```

## Advanced Plugin Features

### State Management

```javascript
export class StatefulPlugin extends Plugin {
  constructor(config) {
    super(config);
    this.state = new Map();
  }

  setState(key, value) {
    this.state.set(key, value);
    this.emit('state:changed', { key, value });
  }

  getState(key) {
    return this.state.get(key);
  }
}
```

### Inter-Plugin Communication

```javascript
export class PluginA extends Plugin {
  async onLoad() {
    this.on('pluginB:event', this.handlePluginBEvent);
  }

  async sendToPluginB(data) {
    this.emit('pluginA:data', data);
  }
}
```

### Middleware Support

```javascript
export class MiddlewarePlugin extends Plugin {
  async onMessage(message, next) {
    // Pre-processing
    console.log('Before:', message.content);

    // Call next plugin
    const result = await next();

    // Post-processing
    console.log('After:', result);

    return result;
  }
}
```

## Publishing Your Plugin

### 1. Prepare package.json

```json
{
  "name": "loongbot-plugin-weather",
  "version": "1.0.0",
  "description": "Weather plugin for BeatAI",
  "main": "index.js",
  "keywords": ["loongbot", "plugin", "weather"],
  "peerDependencies": {
    "loongbot": "^1.0.0"
  }
}
```

### 2. Add README

Create `README.md` with usage instructions.

### 3. Publish to npm

```bash
npm login
npm publish
```

## Plugin Best Practices

1. **Single Responsibility**: One plugin, one purpose
2. **Error Handling**: Always catch and handle errors
3. **Configuration**: Use config for API keys and settings
4. **Testing**: Write comprehensive tests
5. **Documentation**: Document all public methods
6. **Versioning**: Follow semantic versioning

## Example Plugins

Check out official plugins for inspiration:

- [loongbot-plugin-logger](https://github.com/loong-ai/plugin-logger)
- [loongbot-plugin-analytics](https://github.com/loong-ai/plugin-analytics)
- [loongbot-plugin-scheduler](https://github.com/loong-ai/plugin-scheduler)
