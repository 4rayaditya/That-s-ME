# 🚀 Deployment Guide

Complete guide for deploying your 3D portfolio to various platforms.

---

## 🎯 Pre-Deployment Checklist

- [ ] Update personal information in components
- [ ] Add your projects to `src/data/projects.json`
- [ ] Replace placeholder images in `public/images/`
- [ ] Update metadata in `src/app/layout.tsx`
- [ ] Test on multiple devices and browsers
- [ ] Run Lighthouse audit
- [ ] Set up analytics (optional)

---

## 🔷 Vercel (Recommended)

**Why Vercel?**
- Zero configuration
- Automatic HTTPS
- Edge CDN
- Preview deployments
- Built by Next.js creators

### Setup

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Add in: Project Settings → Environment Variables

---

## 🎨 Netlify

### Setup

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **netlify.toml**:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Deploy**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

---

## ☁️ AWS Amplify

### Setup

1. **Connect Repository**:
   - Open AWS Amplify Console
   - Connect your GitHub repository

2. **Build Settings**:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**:
   Add in: App Settings → Environment Variables

---

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Build & Run

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

---

## 🌊 DigitalOcean App Platform

### app.yaml

```yaml
name: portfolio
services:
  - name: web
    github:
      repo: yourusername/portfolio
      branch: main
    build_command: npm run build
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
    http_port: 3000
```

---

## ⚙️ Self-Hosted (VPS)

### Prerequisites

- Ubuntu 20.04+ or similar
- Node.js 18+
- Nginx
- PM2

### Setup

1. **Clone Repository**:
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   npm install
   npm run build
   ```

2. **Install PM2**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "portfolio" -- start
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 📊 Performance Monitoring

### Vercel Analytics

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics

1. **Install**:
   ```bash
   npm install @next/third-parties
   ```

2. **Add to layout**:
   ```typescript
   import { GoogleAnalytics } from '@next/third-parties/google';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics gaId="G-XXXXXXXXXX" />
         </body>
       </html>
     );
   }
   ```

---

## 🔍 SEO Optimization

### Sitemap

Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.com</loc>
    <lastmod>2024-12-20</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

### robots.txt

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://yoursite.com/sitemap.xml
```

---

## 🎯 Post-Deployment

### 1. Test Performance

```bash
# Lighthouse
npx lighthouse https://yoursite.com --view

# PageSpeed Insights
# Visit: https://pagespeed.web.dev/
```

### 2. Monitor Errors

Set up error tracking:
- [Sentry](https://sentry.io)
- [LogRocket](https://logrocket.com)
- [Bugsnag](https://bugsnag.com)

### 3. Set Up CI/CD

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

---

## 🐛 Troubleshooting

### Build Fails

1. Clear cache:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. Check Node version:
   ```bash
   node --version  # Should be 18+
   ```

### 3D Not Rendering in Production

1. Check browser console
2. Verify WebGL support
3. Check CSP headers (shouldn't block WebGL)
4. Verify assets are accessible

### Slow Loading

1. Check bundle size:
   ```bash
   npm run build
   # Look for large chunks
   ```

2. Analyze bundle:
   ```bash
   npm install -g @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Performance Best Practices](https://nextjs.org/docs/advanced-features/measuring-performance)

---

**Need Help?** Open an issue on GitHub or contact via email.

**Last Updated**: December 2024
