---
title: Configuration
description: Complete guide to configuring BeatAI for different environments and use cases.
---

# Configuration

Learn how to configure BeatAI for optimal performance and functionality.

## Configuration File

Create `loongbot.config.js` in your project root:

```javascript
export default {
  name: 'MyBot',
  version: '1.0.0',

  ai: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000
  },

  plugins: [
    '@loongbot/logger',
    '@loongbot/analytics'
  ],

  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  database: {
    type: 'mongodb',
    url: process.env.MONGODB_URL
  }
};
```

## Environment Variables

Use `.env` for sensitive configuration:

```env
# AI Provider
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=...

# Database
MONGODB_URL=mongodb://localhost:27017/loongbot

# Server
PORT=3000
NODE_ENV=production

# Logging
LOG_LEVEL=info
```

## AI Provider Configuration

### OpenAI

```javascript
{
  ai: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  }
}
```

### Anthropic Claude

```javascript
{
  ai: {
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-opus',
    maxTokens: 4000
  }
}
```

### Google Gemini

```javascript
{
  ai: {
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY,
    model: 'gemini-pro',
    temperature: 0.9
  }
}
```

## Plugin Configuration

Configure plugins individually:

```javascript
{
  plugins: [
    {
      name: '@loongbot/logger',
      config: {
        level: 'info',
        file: './logs/bot.log',
        maxFiles: 5
      }
    },
    {
      name: '@loongbot/analytics',
      config: {
        apiKey: process.env.ANALYTICS_KEY,
        track: ['messages', 'errors']
      }
    }
  ]
}
```

## Database Configuration

### MongoDB

```javascript
{
  database: {
    type: 'mongodb',
    url: process.env.MONGODB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
}
```

### PostgreSQL

```javascript
{
  database: {
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    database: 'loongbot',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
}
```

### Redis (Cache)

```javascript
{
  cache: {
    type: 'redis',
    url: process.env.REDIS_URL,
    ttl: 3600
  }
}
```

## Server Configuration

```javascript
{
  server: {
    port: 3000,
    host: '0.0.0.0',
    cors: {
      origin: '*',
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  }
}
```

## Logging Configuration

```javascript
{
  logging: {
    level: 'info',  // debug, info, warn, error
    format: 'json',
    transports: [
      {
        type: 'console',
        colorize: true
      },
      {
        type: 'file',
        filename: 'logs/app.log',
        maxSize: '10m',
        maxFiles: 5
      }
    ]
  }
}
```

## Security Configuration

```javascript
{
  security: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d'
    },
    encryption: {
      algorithm: 'aes-256-gcm',
      key: process.env.ENCRYPTION_KEY
    },
    rateLimit: {
      enabled: true,
      maxRequests: 100,
      windowMs: 60000
    }
  }
}
```

## Performance Optimization

```javascript
{
  performance: {
    cache: {
      enabled: true,
      ttl: 300,
      maxSize: 1000
    },
    clustering: {
      enabled: true,
      workers: 'auto'  // or specific number
    },
    compression: {
      enabled: true,
      level: 6
    }
  }
}
```

## Environment-Specific Config

Create multiple config files:

- `loongbot.config.js` - Base config
- `loongbot.config.dev.js` - Development
- `loongbot.config.prod.js` - Production

Load based on environment:

```javascript
import baseConfig from './loongbot.config.js';
import devConfig from './loongbot.config.dev.js';
import prodConfig from './loongbot.config.prod.js';

const config = {
  ...baseConfig,
  ...(process.env.NODE_ENV === 'production' ? prodConfig : devConfig)
};

export default config;
```

## Configuration Validation

Use schema validation:

```javascript
import Joi from 'joi';

const configSchema = Joi.object({
  name: Joi.string().required(),
  ai: Joi.object({
    provider: Joi.string().valid('openai', 'anthropic', 'google').required(),
    apiKey: Joi.string().required(),
    model: Joi.string().required()
  }).required(),
  server: Joi.object({
    port: Joi.number().port().default(3000),
    host: Joi.string().default('0.0.0.0')
  })
});

const { error, value } = configSchema.validate(config);
if (error) {
  throw new Error(`Config validation failed: ${error.message}`);
}
```
