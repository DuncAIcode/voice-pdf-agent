# 🚀 Vercel Deployment Options

Three ways to deploy your frontend to Vercel, based on official Vercel documentation.

---

## Option 1: Windows Batch Script (Easiest)

**Best for:** Windows users who want a simple, guided deployment

### Steps:
```cmd
# Just run the script
deploy-vercel.bat
```

The script will:
1. ✅ Install Vercel CLI
2. ✅ Login to Vercel (opens browser)
3. ✅ Link your project
4. ✅ Deploy to production

After deployment, set your backend URL:
```cmd
cd frontend
vercel env add NEXT_PUBLIC_API_URL production
# Paste your Railway backend URL when prompted
vercel --prod
```

---

## Option 2: Bash Script (Mac/Linux)

**Best for:** Mac/Linux users or Git Bash on Windows

### Steps:
```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

The script will:
1. ✅ Install Vercel CLI
2. ✅ Login to Vercel
3. ✅ Link your project
4. ✅ Set environment variables (interactive)
5. ✅ Deploy to production

---

## Option 3: TypeScript SDK (Advanced/Programmatic)

**Best for:** Automation, CI/CD pipelines, or developers who want full control

### Setup:
```bash
# Install dependencies
npm install @vercel/sdk tsx

# Get your Vercel token
# Go to: https://vercel.com/account/tokens
# Create a new token and copy it
```

### Usage:
```bash
# Set environment variables
export VERCEL_TOKEN=your-vercel-token-here
export BACKEND_URL=https://your-backend.railway.app

# Run the deployment script
npx tsx deploy-vercel.ts
```

### What it does:
- Creates/links Vercel project programmatically
- Configures environment variables
- Triggers deployment
- Polls for deployment status
- Returns deployment URL

### Example Output:
```
🚀 Starting Vercel deployment...

📦 Creating/linking Vercel project...
✅ Project created: prj_abc123

⚙️ Configuring environment variables...
✅ Environment variables configured

🚀 Triggering deployment...
✅ Deployment initiated: dpl_xyz789
🔗 URL: https://voice-pdf-agent.vercel.app
🔍 Inspect: https://vercel.com/...

⏳ Waiting for deployment to complete...
   Status: BUILDING (5s)
   Status: BUILDING (10s)
   Status: READY (15s)

🎉 Deployment successful!
🌐 Your app is live at: https://voice-pdf-agent.vercel.app
```

---

## Quick Comparison

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Windows Batch** | Simple, guided | Windows only | Beginners |
| **Bash Script** | Cross-platform | Requires bash | Most users |
| **TypeScript SDK** | Fully automated | More setup | Advanced/CI-CD |

---

## Post-Deployment Steps

### 1. Get Your Deployment URL
After any method, you'll get a URL like:
```
https://voice-pdf-agent.vercel.app
```

### 2. Update Backend CORS
Edit `backend/main.py` to allow your Vercel URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://voice-pdf-agent.vercel.app",  # Add this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Push CORS Update
```bash
git add backend/main.py
git commit -m "Update CORS for Vercel deployment"
git push origin main
```

### 4. Test Your Deployment
Visit your Vercel URL and test:
- [ ] Frontend loads
- [ ] Can upload PDFs
- [ ] Can record audio
- [ ] Backend connection works

---

## Troubleshooting

### "VERCEL_TOKEN not found"
**Solution:** Get token from https://vercel.com/account/tokens

### "Deployment failed: Build error"
**Solution:** Check build logs in Vercel dashboard

### "Frontend can't connect to backend"
**Solution:** 
1. Check `NEXT_PUBLIC_API_URL` is set correctly
2. Verify CORS is configured
3. Ensure backend is running

### "Environment variables not working"
**Solution:** 
1. Vercel dashboard → Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_API_URL` 
3. Redeploy

---

## Future Deployments

After initial setup, deploying updates is simple:

```bash
# Method 1: CLI
cd frontend
vercel --prod

# Method 2: Auto-deploy on git push
git push origin main  # Vercel auto-deploys
```

---

## Documentation Sources

All scripts based on:
- ✅ Vercel CLI Documentation (Context7)
- ✅ Vercel SDK Documentation (Context7)
- ✅ Vercel REST API Documentation (Context7)

---

**Need help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.
