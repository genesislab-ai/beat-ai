---
title: Core API
description: Complete reference for BeatAI's core API including classes, methods, and properties.
---

# Core API Reference

Complete API documentation for BeatAI core functionality.

## BeatAI Class

The main bot class that orchestrates all functionality.

### Constructor

```javascript
new BeatAI(config)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| config | `Object` | Bot configuration object |
| config.name | `string` | Bot name |
| config.ai | `Object` | AI provider configuration |
| config.plugins | `Array` | Array of plugins to load |

**Example:**

```javascript
const bot = new BeatAI({
  name: 'MyBot',
  ai: {
    provider: 'openai',
    model: 'gpt-4'
  }
});
```

### Methods

#### start()

Starts the bot and initializes all plugins.

```javascript
bot.start()
```

**Returns:** `Promise<void>`

**Example:**

```javascript
await bot.start();
console.log('Bot is running!');
```

#### stop()

Gracefully stops the bot and cleans up resources.

```javascript
bot.stop()
```

**Returns:** `Promise<void>`

#### on(event, handler)

Registers an event handler.

```javascript
bot.on(event, handler)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| event | `string` | Event name |
| handler | `Function` | Event handler function |

**Events:**

- `message` - Incoming message
- `error` - Error occurred
- `ready` - Bot is ready
- `stop` - Bot stopped

**Example:**

```javascript
bot.on('message', async (message) => {
  console.log('Received:', message.content);
  await message.reply('Hello!');
});

bot.on('error', (error) => {
  console.error('Error:', error);
});
```

#### use(plugin)

Loads a plugin into the bot.

```javascript
bot.use(plugin)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| plugin | `Plugin` | Plugin instance |

**Returns:** `BeatAI` (chainable)

**Example:**

```javascript
import { Logger } from '@loongbot/logger';

bot.use(new Logger({ level: 'info' }));
```

#### sendMessage(userId, content)

Sends a message to a user.

```javascript
bot.sendMessage(userId, content)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| userId | `string` | Target user ID |
| content | `string` | Message content |

**Returns:** `Promise<Message>`

**Example:**

```javascript
await bot.sendMessage('user123', 'Hello there!');
```

### Properties

#### bot.ai

Access to AI provider interface.

```javascript
const response = await bot.ai.chat('Hello');
```

#### bot.config

Bot configuration object.

```javascript
console.log(bot.config.name);
```

#### bot.plugins

Map of loaded plugins.

```javascript
const logger = bot.plugins.get('logger');
```

## Message Class

Represents an incoming or outgoing message.

### Properties

#### message.id

Unique message identifier.

```javascript
console.log(message.id); // "msg_123456"
```

#### message.content

Message text content.

```javascript
console.log(message.content); // "Hello bot!"
```

#### message.userId

ID of the message sender.

```javascript
console.log(message.userId); // "user_123"
```

#### message.timestamp

Message timestamp (Date object).

```javascript
console.log(message.timestamp); // Date object
```

#### message.metadata

Additional message metadata.

```javascript
console.log(message.metadata.platform); // "telegram"
```

### Methods

#### reply(content, options)

Reply to the message.

```javascript
message.reply(content, options)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| content | `string` | Reply content |
| options | `Object` | Optional reply options |

**Returns:** `Promise<Message>`

**Example:**

```javascript
await message.reply('Thanks for your message!');

// With options
await message.reply('Here you go:', {
  buttons: ['Yes', 'No'],
  typing: true
});
```

#### react(emoji)

Add a reaction to the message.

```javascript
message.react(emoji)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| emoji | `string` | Emoji to react with |

**Returns:** `Promise<void>`

**Example:**

```javascript
await message.react('👍');
```

## AI Interface

Interface for AI provider interactions.

### chat(prompt, options)

Send a chat message to the AI.

```javascript
bot.ai.chat(prompt, options)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| prompt | `string` | User prompt |
| options | `Object` | Optional parameters |

**Returns:** `Promise<string>`

**Example:**

```javascript
const response = await bot.ai.chat('What is the weather?', {
  temperature: 0.7,
  maxTokens: 100
});
```

### classify(text, labels)

Classify text into categories.

```javascript
bot.ai.classify(text, labels)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| text | `string` | Text to classify |
| labels | `Array<string>` | Possible labels |

**Returns:** `Promise<Object>`

**Example:**

```javascript
const result = await bot.ai.classify(
  'I love this product!',
  ['positive', 'negative', 'neutral']
);
console.log(result.label); // "positive"
console.log(result.confidence); // 0.95
```

### embed(text)

Generate embeddings for text.

```javascript
bot.ai.embed(text)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| text | `string` | Text to embed |

**Returns:** `Promise<Array<number>>`

**Example:**

```javascript
const embedding = await bot.ai.embed('Hello world');
console.log(embedding); // [0.1, -0.2, ...]
```

## Config Object

Configuration object structure.

```javascript
{
  name: string,
  version: string,
  ai: {
    provider: 'openai' | 'anthropic' | 'google',
    apiKey: string,
    model: string,
    temperature?: number,
    maxTokens?: number
  },
  plugins: Array<Plugin | string>,
  server?: {
    port: number,
    host: string
  },
  database?: {
    type: string,
    url: string
  },
  logging?: {
    level: 'debug' | 'info' | 'warn' | 'error',
    format: 'json' | 'text'
  }
}
```

## Type Definitions

### MessageOptions

```typescript
interface MessageOptions {
  buttons?: string[];
  typing?: boolean;
  delay?: number;
  metadata?: Record<string, any>;
}
```

### AIOptions

```typescript
interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string[];
}
```

### PluginConfig

```typescript
interface PluginConfig {
  name: string;
  enabled?: boolean;
  config?: Record<string, any>;
}
```

## Error Handling

All async methods may throw errors:

```javascript
try {
  await bot.start();
} catch (error) {
  if (error.code === 'INVALID_API_KEY') {
    console.error('Invalid API key');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

Common error codes:

- `INVALID_API_KEY` - Invalid AI provider API key
- `RATE_LIMIT_EXCEEDED` - Rate limit hit
- `NETWORK_ERROR` - Network connectivity issue
- `PLUGIN_ERROR` - Plugin failed to load
