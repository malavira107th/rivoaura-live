# Deploying Rivoaura Live to Vercel

Complete guide to deploy your Rivoaura Live platform on Vercel.

---

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/malavira107th/rivoaura-live)

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ A Vercel account (sign up at [vercel.com](https://vercel.com))
2. ✅ Your GitHub repository pushed (https://github.com/malavira107th/rivoaura-live)
3. ✅ A MySQL database (recommended: [PlanetScale](https://planetscale.com) or [Railway](https://railway.app))
4. ✅ All environment variables ready (see below)

---

## 🔧 Step-by-Step Deployment

### Step 1: Import Your Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select **GitHub** and authorize Vercel to access your repositories
4. Find and select `malavira107th/rivoaura-live`
5. Click **"Import"**

### Step 2: Configure Project Settings

**Framework Preset:** Vite  
**Root Directory:** `./` (leave as default)  
**Build Command:** `pnpm build`  
**Output Directory:** `dist`  
**Install Command:** `pnpm install`

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add the following:

#### Required Variables

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=your-app-id-here

# Owner Information
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Your Name

# API Services
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-backend-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# App Branding
VITE_APP_TITLE=Rivoaura Live
VITE_APP_LOGO=https://d2xsxph8kpxj0f.cloudfront.net/rivoaura-live-assets/logo.webp
```

#### Optional Variables

```env
# Analytics (if using)
VITE_ANALYTICS_ENDPOINT=https://your-analytics.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, Vercel will provide you with a URL like `https://rivoaura-live.vercel.app`

---

## 🗄️ Database Setup

### Option 1: PlanetScale (Recommended)

1. Create a free account at [planetscale.com](https://planetscale.com)
2. Create a new database: `rivoaura-live`
3. Get the connection string from **"Connect"** → **"Node.js"**
4. Copy the `DATABASE_URL` and add it to Vercel environment variables
5. Run migrations:
   ```bash
   pnpm db:push
   ```

### Option 2: Railway MySQL

1. Create a free account at [railway.app](https://railway.app)
2. Create a new project and add **MySQL** service
3. Copy the `DATABASE_URL` from Railway
4. Add it to Vercel environment variables
5. Run migrations:
   ```bash
   pnpm db:push
   ```

### Option 3: Your Own MySQL Server

If you have your own MySQL server:

```env
DATABASE_URL=mysql://username:password@your-host:3306/rivoaura_live
```

---

## 🌐 Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to your project dashboard on Vercel
2. Click **"Settings"** → **"Domains"**
3. Enter your domain: `rivoauralive.com`
4. Click **"Add"**

### Step 2: Configure DNS

Vercel will provide you with DNS records. Add these to your domain registrar:

**For root domain (rivoauralive.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Verify

1. Wait for DNS propagation (5-30 minutes)
2. Vercel will automatically issue an SSL certificate
3. Your site will be live at `https://rivoauralive.com`

---

## ⚙️ Vercel Configuration File

Create a `vercel.json` in your project root for advanced configuration:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

---

## 🔄 Continuous Deployment

Vercel automatically deploys your app when you push to GitHub:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Vercel automatically detects the push and deploys

### Branch Deployments

- **Production:** Pushes to `main` branch deploy to your custom domain
- **Preview:** Pushes to other branches create preview deployments

---

## 🧪 Testing Your Deployment

After deployment, test these features:

- [ ] Homepage loads correctly
- [ ] User can sign up/login
- [ ] Create a new watch party
- [ ] Join an existing party
- [ ] Audio room connects successfully
- [ ] Chat messages send and receive
- [ ] Host moderation controls work
- [ ] Mobile responsive design works

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Module not found`
- **Solution:** Ensure all dependencies are in `package.json`
- Run `pnpm install` locally to verify

**Error:** `Environment variable not found`
- **Solution:** Double-check all required env vars are added in Vercel dashboard

### Database Connection Issues

**Error:** `ECONNREFUSED` or `Connection timeout`
- **Solution:** Verify `DATABASE_URL` is correct
- Ensure database allows connections from Vercel IPs (0.0.0.0/0 for PlanetScale/Railway)

### WebSocket Not Working

**Error:** WebSocket connection fails
- **Solution:** Vercel doesn't support WebSocket on serverless functions
- **Workaround:** Use Vercel for frontend only, deploy backend on Railway/Render

### OAuth Redirect Issues

**Error:** OAuth callback fails
- **Solution:** Add your Vercel domain to OAuth allowed redirect URLs
- Update `VITE_OAUTH_PORTAL_URL` if needed

---

## 📊 Performance Optimization

### Enable Edge Functions

For better performance, enable Vercel Edge Functions:

```typescript
// server/_core/index.ts
export const config = {
  runtime: 'edge',
};
```

### Enable Caching

Add cache headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 💰 Pricing

**Vercel Free Tier includes:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments

**Upgrade to Pro ($20/month) for:**
- More bandwidth
- Team collaboration
- Advanced analytics
- Priority support

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Use Vercel environment variables
2. **Rotate secrets regularly** - Update `JWT_SECRET` and API keys periodically
3. **Enable Vercel Authentication** - Protect preview deployments
4. **Use strong passwords** - For database and admin accounts
5. **Enable 2FA** - On Vercel and GitHub accounts

---

## 📞 Support

**Deployment Issues:**
- Vercel Support: https://vercel.com/support
- Vercel Community: https://github.com/vercel/vercel/discussions

**App Issues:**
- Email: support@rivoauralive.com
- GitHub Issues: https://github.com/malavira107th/rivoaura-live/issues

---

## 🎉 Success!

Your Rivoaura Live platform is now deployed on Vercel!

**Next Steps:**
1. ✅ Test all features thoroughly
2. ✅ Set up Google Ads campaigns
3. ✅ Monitor analytics and performance
4. ✅ Invite users and start hosting watch parties!

---

**Deployed URL:** https://rivoaura-live.vercel.app  
**Custom Domain:** https://rivoauralive.com  
**GitHub:** https://github.com/malavira107th/rivoaura-live

Built with ❤️ for cricket fans worldwide
