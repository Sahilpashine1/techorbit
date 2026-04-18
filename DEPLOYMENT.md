# TechOrbit - Deployment Guide

## Deploy to Vercel (Free - 5 minutes)

### Step 1: Push to GitHub
```bash
cd e:\project2
git init
git add .
git commit -m "TechOrbit platform"
git branch -M main
# Create a repo at https://github.com/new then:
git remote add origin https://github.com/YOUR_USERNAME/techorbit.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com and sign up (free)
2. Click "New Project"
3. Import your GitHub repo `techorbit`
4. Framework: **Next.js** (auto-detected)
5. Click **Deploy**

### Step 3: Add Environment Variables
In Vercel Dashboard > Your Project > Settings > Environment Variables, add:

| Variable | Value | How to get |
|----------|-------|------------|
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel URL |
| `NEXTAUTH_SECRET` | `TechOrbit2026SecretKeyForJWT!!` | Any 32+ char string |
| `MONGODB_URI` | `mongodb+srv://...` | [MongoDB Atlas Free](https://www.mongodb.com/atlas) |
| `GOOGLE_CLIENT_ID` | `xxxx.apps.googleusercontent.com` | [Google Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxxx` | [Google Console](https://console.cloud.google.com) |
| `GITHUB_CLIENT_ID` | `Ov23li...` | [GitHub Settings > Developer apps](https://github.com/settings/developers) |
| `GITHUB_CLIENT_SECRET` | `xxxxx` | [GitHub Settings > Developer apps](https://github.com/settings/developers) |
| `ADZUNA_APP_ID` | `xxxxx` | [Adzuna API](https://developer.adzuna.com) - Free |
| `ADZUNA_API_KEY` | `xxxxx` | [Adzuna API](https://developer.adzuna.com) - Free |
| `NEWSDATA_API_KEY` | `pub_xxxx` | [NewsData.io](https://newsdata.io) - Free |

### Step 4: Set OAuth Callback URLs

**Google OAuth:**
- Go to: https://console.cloud.google.com > APIs > Credentials
- Add Authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

**GitHub OAuth:**
- Go to: https://github.com/settings/developers > New OAuth App
- Homepage URL: `https://your-app.vercel.app`
- Callback URL: `https://your-app.vercel.app/api/auth/callback/github`

### Step 5: Get Free API Keys

#### MongoDB Atlas (Database)
1. Go to https://www.mongodb.com/atlas/database
2. Create free account > Build a Database > Free tier (M0)
3. Set username/password > Connect > Drivers > Copy connection string
4. Replace `<password>` in the URI with your password

#### Adzuna (Real Jobs API)
1. Go to https://developer.adzuna.com
2. Register (free) > Get API keys (free: 100 req/day)

#### NewsData.io (Real News API)
1. Go to https://newsdata.io
2. Register free > Get API key (free: 200 req/day)

---

## Demo Login Credentials (works without DB)
- User: `user@demo.com` / `demo123`
- Company: `company@demo.com` / `demo123`
- Admin: `admin@techorbit.in` / `admin123`

## Local Development
```bash
npm install
npm run dev
# Open http://localhost:3000
```
