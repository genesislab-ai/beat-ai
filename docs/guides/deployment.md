---
title: Deployment
description: Deploy BeatAI to production environments including cloud platforms, containers, and serverless.
---

# Deployment

This guide covers deploying BeatAI to various production environments.

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates obtained
- [ ] Monitoring setup
- [ ] Backup strategy defined
- [ ] Load testing completed

## Platform-Specific Deployment

### Heroku

1. Install Heroku CLI
2. Create app and deploy:

```bash
heroku create my-loongbot
heroku config:set OPENAI_API_KEY=your-key
git push heroku main
heroku logs --tail
```

### AWS EC2

1. Launch EC2 instance
2. Install dependencies:

```bash
ssh ec2-user@your-instance
sudo yum update -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo yum install -y nodejs
```

3. Deploy application:

```bash
git clone your-repo
cd loongbot
npm install --production
pm2 start src/index.js --name loongbot
pm2 save
pm2 startup
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
```

Build and run:

```bash
docker build -t loongbot .
docker run -d -p 3000:3000 --env-file .env loongbot
```

### Kubernetes

Create `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: loongbot
spec:
  replicas: 3
  selector:
    matchLabels:
      app: loongbot
  template:
    metadata:
      labels:
        app: loongbot
    spec:
      containers:
      - name: loongbot
        image: your-registry/loongbot:latest
        ports:
        - containerPort: 3000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: loongbot-secrets
              key: openai-key
```

Deploy:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### Vercel (Serverless)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Configure `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ]
}
```

3. Deploy:

```bash
vercel --prod
```

## Production Configuration

### Process Management

Use PM2 for process management:

```bash
npm install -g pm2
pm2 start src/index.js -i max --name loongbot
pm2 startup
pm2 save
```

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'loongbot',
    script: 'src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
```

### Load Balancing

Nginx configuration:

```nginx
upstream loongbot {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://loongbot;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/TLS

Use Let's Encrypt:

```bash
sudo certbot --nginx -d your-domain.com
```

### Monitoring

Setup monitoring with Prometheus:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'loongbot'
    static_configs:
      - targets: ['localhost:3000']
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - name: Deploy to production
        run: |
          ssh ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} '
            cd /app/loongbot &&
            git pull &&
            npm install --production &&
            pm2 restart loongbot
          '
```

## Scaling Strategies

### Horizontal Scaling

Use container orchestration:

```bash
# Docker Swarm
docker service scale loongbot=5

# Kubernetes
kubectl scale deployment loongbot --replicas=5
```

### Vertical Scaling

Increase resources:

```bash
# EC2: Change instance type
# Container: Increase CPU/memory limits
```

## Backup and Recovery

### Database Backups

```bash
# MongoDB
mongodump --uri="mongodb://localhost/loongbot" --out=/backup

# PostgreSQL
pg_dump loongbot > backup.sql
```

### Automated Backups

Create backup script:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
mongodump --out=/backups/$DATE
aws s3 cp /backups/$DATE s3://my-backups/ --recursive
find /backups -mtime +7 -exec rm -rf {} \;
```

Add to crontab:

```bash
0 2 * * * /path/to/backup.sh
```

## Security Hardening

1. Use environment variables for secrets
2. Enable firewall rules
3. Regular security updates
4. Use HTTPS only
5. Implement rate limiting
6. Enable logging and monitoring
7. Regular security audits

## Performance Optimization

- Enable caching (Redis)
- Use CDN for static assets
- Compress responses (gzip)
- Optimize database queries
- Implement connection pooling
- Use load balancers

## Troubleshooting

### High Memory Usage

```bash
# Check memory
pm2 monit

# Restart with memory limit
pm2 start app.js --max-memory-restart 500M
```

### Connection Issues

```bash
# Check logs
pm2 logs loongbot

# Check network
netstat -tulpn | grep 3000
```
