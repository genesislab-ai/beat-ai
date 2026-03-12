---
title: Quick Start Guide
description: Get up and running with BeatAI in less than 5 minutes.
---

# Quick Start Guide

This guide will help you create and run your first BeatAI in minutes.

## Prerequisites

Before you begin, make sure you have:

- Node.js 16+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)

## Installation

Install BeatAI using npm:

```bash
npm install -g loongbot-cli
```

Or with yarn:

```bash
yarn global add loongbot-cli
```

## Create Your First Bot

Use the CLI to create a new bot project:

```bash
loongbot create my-first-bot
cd my-first-bot
```

This creates a new project with the following structure:

```
my-first-bot/
├── src/
│   ├── index.js
│   └── plugins/
├── package.json
└── .env.example
```

## Configure Your Bot

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# AI Provider (openai, anthropic, google)
AI_PROVIDER=openai
OPENAI_API_KEY=your-api-key-here

# Bot Configuration
BOT_NAME=MyFirstBot
BOT_DESCRIPTION=My awesome AI bot
```

## Write Your First Handler

Edit `src/index.js`:

```javascript
import { BeatAI } from 'loongbot';

const bot = new BeatAI({
  name: process.env.BOT_NAME,
  ai: {
    provider: process.env.AI_PROVIDER,
    apiKey: process.env.OPENAI_API_KEY
  }
});

// Handle messages
bot.on('message', async (message) => {
  console.log(`Received: ${message.content}`);

  // Echo the message
  await message.reply(`You said: ${message.content}`);
});

// Start the bot
bot.start();
console.log('🚀 Bot is running!');
```

## Run Your Bot

Start the development server:

```bash
npm run dev
```

You should see:

```
🚀 Bot is running!
✓ Connected to AI provider
✓ Listening for messages...
```

## Test Your Bot

Your bot is now ready to receive messages! The exact method depends on your platform integration, but for testing you can use the built-in CLI mode:

```bash
loongbot test
```

This opens an interactive console where you can chat with your bot.

## Next Steps

Congratulations! You've created your first BeatAI. Here's what to explore next:

- [Building Your First Bot](/docs/guides/first-bot) - Deep dive into bot development
- [Plugin Development](/docs/guides/plugin-development) - Extend your bot's capabilities
- [Configuration](/docs/guides/configuration) - Advanced configuration options
- [API Reference](/docs/api/core) - Explore the full API

## Common Issues

### Port Already in Use

If you see "Port 3000 already in use":

```bash
PORT=3001 npm run dev
```

### API Key Not Found

Make sure your `.env` file is in the project root and properly formatted.

### Module Not Found

Try reinstalling dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Get Help

Need assistance? We're here to help:

- [GitHub Issues](https://github.com/loong-ai/loongbot/issues)
- [Discord Community](https://discord.gg/loongbot)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/loongbot)
