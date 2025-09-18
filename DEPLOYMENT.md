# 🚀 Deployment Guide

This guide will help you deploy your House Warming Party RSVP application to various free hosting platforms.

## Quick Deploy Options

### 1. Vercel (Recommended - Free)

**Why Vercel?**

- Free tier with generous limits
- Built by the creators of Next.js
- Automatic deployments from GitHub
- Global CDN
- No configuration needed

**Steps:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

Your app will be live at `https://your-project-name.vercel.app`

### 2. Netlify (Free)

**Steps:**

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up/login
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"

### 3. Railway (Free tier available)

**Steps:**

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and sign up/login
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect Next.js and deploy

## Environment Variables

For production, you might want to add these environment variables:

```bash
# Optional: Add to your hosting platform's environment variables
NEXT_PUBLIC_PARTY_DATE="2025-11-08"
NEXT_PUBLIC_PARTY_TIME="7:00 PM"
NEXT_PUBLIC_PARTY_LOCATION="123 Main St, City, State"
```

## Custom Domain (Optional)

### Vercel

1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### Netlify

1. Go to your site dashboard
2. Click "Domain settings"
3. Add custom domain
4. Configure DNS records

## Database Options (For Production)

The current app uses in-memory storage. For production, consider:

### Supabase (Free tier)

```bash
npm install @supabase/supabase-js
```

### PlanetScale (Free tier)

```bash
npm install @planetscale/database
```

### MongoDB Atlas (Free tier)

```bash
npm install mongodb
```

## Monitoring & Analytics

### Vercel Analytics (Free)

- Automatically included with Vercel deployment
- Page views, performance metrics
- No code changes needed

### Google Analytics

1. Create a Google Analytics account
2. Add your tracking ID to environment variables
3. Add the Google Analytics script to your layout

## Performance Optimization

The app is already optimized with:

- ✅ Next.js 15 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Static generation where possible

## Troubleshooting

### Build Errors

- Ensure Node.js version is 18+
- Run `npm install` before building
- Check for TypeScript errors with `npm run type-check`

### Deployment Issues

- Verify all environment variables are set
- Check build logs for errors
- Ensure repository is public (for free tiers)

### Performance Issues

- Images are automatically optimized by Next.js
- CSS is automatically purged by Tailwind
- JavaScript is automatically code-split

## Cost Breakdown

**Free Tier Limits:**

- Vercel: 100GB bandwidth/month, unlimited builds
- Netlify: 100GB bandwidth/month, 300 build minutes/month
- Railway: $5 credit/month (usually covers small apps)

**For 100 guests:**

- Bandwidth: ~1-5GB/month
- Builds: ~10-20/month
- Storage: Minimal

All well within free tier limits! 🎉

## Support

If you encounter issues:

1. Check the hosting platform's documentation
2. Review Next.js deployment docs
3. Check the application logs in your hosting dashboard
