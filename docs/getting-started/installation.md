---
title: Installation
description: Complete installation guide for BeatAI across different platforms and environments.
---

# Installation

This guide covers installing BeatAI in various environments and platforms.

## System Requirements

### Minimum Requirements

- **Node.js**: 16.0.0 or higher
- **RAM**: 512 MB
- **Disk Space**: 100 MB
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)

### Recommended Requirements

- **Node.js**: 18.0.0 or higher
- **RAM**: 2 GB
- **Disk Space**: 500 MB
- **CPU**: 2+ cores

## Installation Methods

### Using npm

The simplest way to install BeatAI:

```bash
npm install loongbot
```

For global CLI installation:

```bash
npm install -g loongbot-cli
```

### Using yarn

```bash
yarn add loongbot
```

For global CLI:

```bash
yarn global add loongbot-cli
```

### Using pnpm

```bash
pnpm add loongbot
```

### From Source

Clone and build from source:

```bash
git clone https://github.com/loong-ai/loongbot.git
cd loongbot
npm install
npm run build
npm link
```

## Docker Installation

Run BeatAI in a container:

```bash
docker pull loongbot/loongbot:latest
docker run -d \
  --name my-loongbot \
  -e OPENAI_API_KEY=your-key \
  loongbot/loongbot:latest
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  loongbot:
    image: loongbot/loongbot:latest
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - BOT_NAME=MyBot
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## Verifying Installation

Check the installation:

```bash
loongbot --version
```

Expected output:

```
loongbot v1.0.0
```

Run the doctor command:

```bash
loongbot doctor
```

This checks your environment and reports any issues.

## Platform-Specific Notes

### Windows

On Windows, you may need to install build tools:

```bash
npm install --global windows-build-tools
```

### macOS

Install Xcode Command Line Tools:

```bash
xcode-select --install
```

### Linux

Install build essentials:

```bash
# Ubuntu/Debian
sudo apt-get install build-essential

# CentOS/RHEL
sudo yum groupinstall "Development Tools"
```

## Updating BeatAI

### npm

```bash
npm update loongbot
```

### Global CLI

```bash
npm update -g loongbot-cli
```

### Check for Updates

```bash
loongbot check-update
```

## Uninstalling

### Remove Package

```bash
npm uninstall loongbot
```

### Remove Global CLI

```bash
npm uninstall -g loongbot-cli
```

### Clean Cache

```bash
npm cache clean --force
```

## Next Steps

Now that you have BeatAI installed:

1. Follow the [Quick Start Guide](/docs/getting-started/quick-start)
2. Explore [Configuration Options](/docs/guides/configuration)
3. Check out [Example Projects](https://github.com/loong-ai/loongbot-examples)

## Troubleshooting

### Permission Errors

On Linux/macOS, you may need to use sudo or fix npm permissions:

```bash
sudo chown -R $(whoami) ~/.npm
```

### Network Issues

If installation fails due to network issues, try:

```bash
npm config set registry https://registry.npmjs.org/
npm install loongbot --verbose
```

### Version Conflicts

Clear npm cache and reinstall:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
