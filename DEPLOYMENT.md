# 🚀 Deployment Guide

Complete guide for deploying the PDF Automation Agent to production.

---

## 📋 Pre-Deployment Checklist

### ✅ Required Accounts
- [ ] GitHub account
- [ ] Vercel account (for frontend)
- [ ] Railway/Render account (for backend)
- [ ] Supabase project created
- [ ] Google AI API key obtained

### ✅ Environment Variables Ready
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_KEY`
- [ ] `GEMINI_API_KEY`
- [ ] `NEXT_PUBLIC_API_URL` (production backend URL)

---

## 1️⃣ GitHub Setup

### Option A: Using GitHub MCP (Automated)
MCP can create the repository and push code automatically.

### Option B: Manual Setup

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: PDF Automation Agent v1.0.0"

# Create GitHub repository (via web interface)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/voice-pdf-agent.git
git branch -M main
git push -u origin main
```

---

## 2️⃣ Frontend Deployment (Vercel)

### Step 1: Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 2: Configure Build Settings
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 3: Environment Variables
Add in Vercel dashboard:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### Step 4: Deploy
- Click **"Deploy"**
- Wait for build to complete (~2-3 minutes)
- You'll get a URL like: `https://voice-pdf-agent.vercel.app`

---

## 3️⃣ Backend Deployment (Railway)

### Why Railway?
- ✅ Python support out of the box
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ PostgreSQL add-on support

### Step 1: Create New Project
1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository

### Step 2: Configure Service
```
Root Directory: backend
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 3: Environment Variables
Add in Railway dashboard:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
PORT=8000
```

### Step 4: Add Procfile (Optional)
Create `backend/Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 5: Deploy
- Railway auto-deploys on git push
- Get your backend URL: `https://your-app.railway.app`

---

## 4️⃣ Alternative Backend: Render

### Step 1: Create Web Service
1. Go to [Render Dashboard](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository

### Step 2: Configure
```
Name: voice-pdf-backend
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 3: Environment Variables
Same as Railway (above)

### Step 4: Choose Plan
- Free tier available (spins down after inactivity)
- Starter plan: $7/month (always on)

---

## 5️⃣ Database Setup (Supabase)

### Already Configured
Your Supabase database is ready with:
- ✅ Tables created (`documents`, `form_fields`, `transcriptions`)
- ✅ Row Level Security enabled
- ✅ Auth configured

### Production Checklist
- [ ] Review RLS policies
- [ ] Enable database backups
- [ ] Set up custom domain (optional)
- [ ] Configure email templates

---

## 6️⃣ File Storage Migration

### Current Setup
- Files stored locally in `backend/uploads/`
- ⚠️ Not suitable for production (ephemeral filesystems)

### Recommended: Supabase Storage

#### Step 1: Create Storage Bucket
```sql
-- In Supabase dashboard
CREATE BUCKET pdfs;
```

#### Step 2: Update Backend Code
Replace file system operations with Supabase Storage:

```python
from supabase import create_client

# Upload file
supabase.storage.from_('pdfs').upload(
    path=f'uploads/{filename}',
    file=file_contents
)

# Download file
file_url = supabase.storage.from_('pdfs').get_public_url(
    f'uploads/{filename}'
)
```

#### Step 3: Update RLS Policies
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
```

---

## 7️⃣ Domain Configuration

### Custom Domain for Frontend (Vercel)
1. Go to Vercel project settings
2. Add domain: `yourdomain.com`
3. Configure DNS records (Vercel provides instructions)

### Custom Domain for Backend (Railway)
1. Go to Railway project settings
2. Click "Settings" → "Domains"
3. Add custom domain
4. Update DNS records

---

## 8️⃣ CORS Configuration

### Update Backend for Production

Edit `backend/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "https://voice-pdf-agent.vercel.app",  # Production
        "https://yourdomain.com"  # Custom domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 9️⃣ Environment Variables Summary

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Backend (Railway/Render)
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=AIzaSy...
PORT=8000
ALLOWED_ORIGINS=https://voice-pdf-agent.vercel.app,https://yourdomain.com
```

---

## 🔟 Post-Deployment Testing

### Test Checklist
- [ ] Frontend loads at Vercel URL
- [ ] Backend API responds at `/health`
- [ ] CORS allows frontend to call backend
- [ ] PDF upload works
- [ ] Audio recording works
- [ ] Transcription completes
- [ ] PDF generation succeeds
- [ ] Download/view PDFs works

### Testing Commands
```bash
# Test backend health
curl https://your-backend.railway.app/health

# Test documents endpoint
curl https://your-backend.railway.app/documents

# Check CORS
curl -H "Origin: https://voice-pdf-agent.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://your-backend.railway.app/upload-pdf
```

---

## 🔒 Security Considerations

### Production Best Practices
- [ ] Rotate API keys regularly
- [ ] Enable rate limiting
- [ ] Add authentication to all endpoints
- [ ] Use HTTPS only
- [ ] Review Supabase RLS policies
- [ ] Set up monitoring/alerts
- [ ] Enable error logging (Sentry, etc.)
- [ ] Add request validation
- [ ] Implement file size limits
- [ ] Scan uploaded files for malware

---

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics available
- Monitor page load times
- Track errors

### Railway Logs
- View logs in dashboard
- Set up log drains to external services

### Supabase Monitoring
- Database performance metrics
- API usage statistics
- Storage usage

---

## 🐛 Troubleshooting

### Issue: Frontend Can't Connect to Backend
**Solution:** Check CORS settings and NEXT_PUBLIC_API_URL

### Issue: Build Fails on Vercel
**Solution:** Ensure all dependencies in package.json

### Issue: Backend Crashes
**Solution:** Check Railway logs for Python errors

### Issue: File Uploads Not Working
**Solution:** Migrate to Supabase Storage (ephemeral filesystem issue)

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push
Both Vercel and Railway support automatic deployment:

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push origin main

# Both services auto-deploy
```

---

## 💰 Cost Estimate

### Free Tier (Development)
- Vercel: Free for personal projects
- Railway: $5/month free credit
- Supabase: Free up to 500MB database
- Google AI: Free tier available
**Total: ~$0/month** (with limits)

### Production (Small Scale)
- Vercel Pro: $20/month
- Railway Starter: $5-10/month
- Supabase Pro: $25/month
- Google AI: Pay per use (~$0.01-0.10/request)
**Total: ~$50-60/month**

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Supabase Docs:** https://supabase.com/docs
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/

---

**Status:** Ready for deployment ✅  
**Estimated Setup Time:** 30-60 minutes  
**Difficulty:** Intermediate
