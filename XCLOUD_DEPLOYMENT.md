# XCloud Deployment Guide — Pro SWPPP Next.js Frontend

## Architecture Overview

| Component | URL | Server |
|---|---|---|
| WordPress CMS (headless) | `cms.proswppp.com` | XCloud LiteSpeed |
| Next.js Frontend (staging) | `www2.proswppp.com` | XCloud LiteSpeed |
| Next.js Frontend (production) | `www.proswppp.com` | XCloud LiteSpeed (DNS cutover) |

---

## XCloud Site Setup

### 1. Create a New Site on XCloud

1. Log in to XCloud → **Add New Site**
2. Select **Node.js Application** (not WordPress)
3. Set **Node.js version**: `20.x` (LTS)
4. Set **Application Root**: `/` (project root)
5. Set **Application Entry Point**: `server.js` (Next.js standalone output)

### 2. Connect GitHub Repository

1. In XCloud → **Git Deployment** → connect `bwpaint/proswppp-nextjs`
2. Branch: `main`
3. Auto-deploy on push: **Enabled**

### 3. Build Configuration

| Setting | Value |
|---|---|
| Build Command | `pnpm install && pnpm build` |
| Output Directory | `.next` |
| Node.js Version | `20.x` |
| Package Manager | `pnpm` |

> **Note:** The `build` script in `package.json` already includes `NODE_ENV=production` to prevent a known Next.js 14 build issue in environments where `NODE_ENV` is not set to `production` by default.

### 4. Environment Variables

Set these in XCloud → **Environment Variables**:

```env
# Required
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://www2.proswppp.com

# WordPress GraphQL endpoint (set after cms.proswppp.com is live)
NEXT_PUBLIC_WP_GRAPHQL_URL=https://cms.proswppp.com/graphql

# Quiz lead capture (set after Fluent Forms is configured)
NEXT_PUBLIC_FLUENT_FORMS_URL=https://cms.proswppp.com/wp-json/fluentform/v1/submit
NEXT_PUBLIC_QUIZ_FORM_ID=YOUR_FORM_ID_HERE
```

> **Production cutover:** When switching from `www2` to `www`, only update `NEXT_PUBLIC_SITE_URL`.

### 5. LiteSpeed Reverse Proxy Config

Next.js runs on port `3000` by default. Configure LiteSpeed to proxy requests:

```
# In LiteSpeed Virtual Host → External App
Type: Node.js App
Name: nextjs
Address: localhost:3000
Max Connections: 100

# Rewrite Rules
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

---

## WordPress CMS Setup (cms.proswppp.com)

### Required Plugins

1. **WPGraphQL** — enables `/graphql` endpoint
2. **WPGraphQL for ACF** — if using Advanced Custom Fields
3. **Fluent Forms** — lead capture backend
4. **Headless Mode** *(optional)* — redirects front-end visitors to the Next.js site

### CORS Configuration

Add to `functions.php` or a site-specific plugin to allow GraphQL requests from the frontend:

```php
add_filter('graphql_response_headers_to_send', function($headers) {
    $allowed = ['https://www2.proswppp.com', 'https://www.proswppp.com'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed)) {
        $headers['Access-Control-Allow-Origin'] = $origin;
        $headers['Access-Control-Allow-Credentials'] = 'true';
    }
    return $headers;
});
```

### Fluent Forms — Quiz Form Setup

1. Create a new form in Fluent Forms with these fields:
   - First Name (`first_name`)
   - Last Name (`last_name`)
   - Email (`email`)
   - Company (`company`)
   - Risk Score — **Hidden field** (`risk_score`)
   - Risk Level — **Hidden field** (`risk_level`)
   - Answers JSON — **Hidden field** (`quiz_answers`)

2. Note the **Form ID** from the URL (e.g., `?form_id=3`)

3. Set `NEXT_PUBLIC_QUIZ_FORM_ID=3` in XCloud environment variables

4. In Fluent CRM → **Tags**: Create tags `High-Risk Lead`, `Medium-Risk Lead`, `Low-Risk Lead`

5. Set up a Fluent Forms automation: **If** `risk_level = HIGH` → **Tag contact** with `High-Risk Lead`

---

## Wiring Live Data (Post-Launch Tasks)

### Blog Posts from WordPress

The `LatestBlogSection` component currently uses static placeholder data. To wire it to live WordPress posts:

```tsx
// In src/components/sections/LatestBlogSection.tsx
// Replace the static blogPosts array with:
import { useEffect, useState } from 'react';
import { gqlClient, GET_RECENT_POSTS } from '@/lib/wpgraphql';

const [posts, setPosts] = useState([]);
useEffect(() => {
  gqlClient.request(GET_RECENT_POSTS, { first: 6 }).then((data) => {
    setPosts(data.posts.nodes);
  });
}, []);
```

The `GET_RECENT_POSTS` query is already defined in `src/lib/wpgraphql.ts`.

---

## Production DNS Cutover (www2 → www)

1. Verify `www2.proswppp.com` is fully approved
2. Update XCloud environment: `NEXT_PUBLIC_SITE_URL=https://www.proswppp.com`
3. Update WordPress CORS config to include `https://www.proswppp.com`
4. Update DNS: Point `www` A record to the XCloud server IP
5. Update WordPress CORS: Remove `www2` from the allowed origins list
6. Verify SSL certificate covers `www.proswppp.com`

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/bwpaint/proswppp-nextjs.git
cd proswppp-nextjs

# Install dependencies
pnpm install

# Copy environment file
cp .env.local.example .env.local
# Edit .env.local with your local values

# Start dev server
pnpm dev
# → http://localhost:3000
```

---

## Key Files Reference

| File | Purpose |
|---|---|
| `src/app/page.tsx` | Homepage — imports all section components |
| `src/app/quiz/QuizClient.tsx` | Interactive Risk Assessment quiz |
| `src/app/layout.tsx` | Root layout with metadata and fonts |
| `src/lib/wpgraphql.ts` | WPGraphQL client and typed queries |
| `src/components/Navigation.tsx` | Sticky nav with mobile menu |
| `src/components/Footer.tsx` | Full footer with contact form |
| `.env.local` | Development environment variables |
| `.env.production` | Production environment variables |
| `next.config.mjs` | Next.js config (image domains, etc.) |
