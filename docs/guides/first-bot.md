---
title: Building Your First Bot
description: A comprehensive guide to building your first production-ready bot with BeatAI.
---

# Building Your First Bot

In this guide, you'll build a fully functional customer support bot from scratch.

## Project Overview

We'll create a bot that can:

- Answer frequently asked questions
- Route complex queries to human agents
- Track conversation history
- Provide multi-language support

## Step 1: Project Setup

Create a new project:

```bash
loongbot create customer-support-bot
cd customer-support-bot
npm install
```

## Step 2: Define Bot Personality

Edit `src/config/personality.js`:

```javascript
export const personality = {
  name: 'SupportBot',
  role: 'Customer Support Assistant',
  tone: 'friendly and professional',
  language: 'en',
  greeting: 'Hello! How can I help you today?'
};
```

## Step 3: Create FAQ Handler

Create `src/handlers/faq.js`:

```javascript
export class FAQHandler {
  constructor() {
    this.faqs = new Map([
      ['hours', 'We are open Monday-Friday, 9 AM - 5 PM EST.'],
      ['shipping', 'Standard shipping takes 3-5 business days.'],
      ['returns', 'Returns are accepted within 30 days of purchase.']
    ]);
  }

  async handle(message) {
    const query = message.content.toLowerCase();

    for (const [key, answer] of this.faqs) {
      if (query.includes(key)) {
        return { found: true, answer };
      }
    }

    return { found: false };
  }
}
```

## Step 4: Implement Main Bot Logic

Edit `src/index.js`:

```javascript
import { BeatAI } from 'loongbot';
import { FAQHandler } from './handlers/faq.js';
import { personality } from './config/personality.js';

const bot = new BeatAI({
  name: personality.name,
  ai: {
    provider: 'openai',
    model: 'gpt-4',
    systemPrompt: `You are ${personality.name}, a ${personality.role}.
      Speak in a ${personality.tone} manner.`
  }
});

const faqHandler = new FAQHandler();

// Handle incoming messages
bot.on('message', async (message) => {
  // First, check FAQ
  const faqResult = await faqHandler.handle(message);

  if (faqResult.found) {
    await message.reply(faqResult.answer);
    return;
  }

  // If not in FAQ, use AI
  const response = await bot.ai.chat(message.content);
  await message.reply(response);

  // Log for analytics
  await bot.logger.info('AI Response', {
    query: message.content,
    response: response
  });
});

// Handle errors gracefully
bot.on('error', async (error) => {
  console.error('Bot error:', error);
  await bot.sendAlert('admin', `Error: ${error.message}`);
});

bot.start();
```

## Step 5: Add Conversation Memory

Create `src/services/memory.js`:

```javascript
export class ConversationMemory {
  constructor() {
    this.conversations = new Map();
  }

  add(userId, message) {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, []);
    }

    this.conversations.get(userId).push({
      content: message,
      timestamp: Date.now()
    });

    // Keep only last 10 messages
    const history = this.conversations.get(userId);
    if (history.length > 10) {
      history.shift();
    }
  }

  get(userId) {
    return this.conversations.get(userId) || [];
  }

  clear(userId) {
    this.conversations.delete(userId);
  }
}
```

## Step 6: Add Human Handoff

Create `src/services/handoff.js`:

```javascript
export class HumanHandoff {
  constructor(bot) {
    this.bot = bot;
    this.queue = [];
  }

  async request(userId, reason) {
    this.queue.push({ userId, reason, timestamp: Date.now() });

    await this.bot.sendMessage(userId,
      'I\'m connecting you with a human agent. Please wait...'
    );

    await this.notifyAgents({ userId, reason });
  }

  async notifyAgents(ticket) {
    // Send to agent dashboard or Slack
    await this.bot.webhook.send('agents', {
      type: 'new_ticket',
      data: ticket
    });
  }
}
```

## Step 7: Testing

Create tests in `test/bot.test.js`:

```javascript
import { BeatAI } from 'loongbot';
import { FAQHandler } from '../src/handlers/faq.js';

describe('Customer Support Bot', () => {
  let bot;

  beforeEach(() => {
    bot = new BeatAI({ test: true });
  });

  test('should answer FAQ questions', async () => {
    const faq = new FAQHandler();
    const result = await faq.handle({
      content: 'What are your hours?'
    });

    expect(result.found).toBe(true);
    expect(result.answer).toContain('9 AM - 5 PM');
  });

  test('should handle unknown queries', async () => {
    const response = await bot.sendTestMessage('random query');
    expect(response).toBeDefined();
  });
});
```

Run tests:

```bash
npm test
```

## Step 8: Deploy

Build for production:

```bash
npm run build
```

Deploy to your platform:

```bash
# Heroku
git push heroku main

# Docker
docker build -t customer-support-bot .
docker push your-registry/customer-support-bot
```

## Complete Example

Here's the full bot in action:

```javascript
import { BeatAI, Plugin } from 'loongbot';

class CustomerSupportBot extends BeatAI {
  constructor(config) {
    super(config);
    this.setupHandlers();
  }

  setupHandlers() {
    this.on('message', this.handleMessage.bind(this));
    this.on('feedback', this.handleFeedback.bind(this));
  }

  async handleMessage(message) {
    const intent = await this.detectIntent(message.content);

    switch(intent) {
      case 'greeting':
        await message.reply('Hello! How can I assist you?');
        break;
      case 'faq':
        await this.handleFAQ(message);
        break;
      case 'complex':
        await this.requestHumanHandoff(message);
        break;
      default:
        await this.handleWithAI(message);
    }
  }

  async detectIntent(text) {
    // Use NLP or AI to detect intent
    const result = await this.ai.classify(text, [
      'greeting', 'faq', 'complex', 'feedback'
    ]);
    return result.intent;
  }
}

const bot = new CustomerSupportBot({
  name: 'SupportBot',
  ai: { provider: 'openai', model: 'gpt-4' }
});

bot.start();
```

## Best Practices

1. **Always validate user input**
2. **Implement rate limiting**
3. **Log all interactions for debugging**
4. **Provide clear error messages**
5. **Monitor bot performance**
6. **Update FAQ regularly**

## Next Steps

- [Plugin Development](/docs/guides/plugin-development)
- [Configuration](/docs/guides/configuration)
- [Deployment Guide](/docs/guides/deployment)
