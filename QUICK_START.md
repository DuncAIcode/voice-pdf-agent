# ⚡ Quick Start Guide

Get your app deployed in **30 minutes** following these steps.

---

## ✅ Deployment Checklist

### 1️⃣ Sign Up for Services (10 minutes)

- [ ] **Hostinger VPS** ($5/month)
  - Go to: https://www.hostinger.com/vps-hosting
  - Choose: KVM 1 plan (~$4.99/month)
  - Complete signup
  - Note: VPS IP address from email
  - Note: Root password from email

- [ ] **Get Hostinger API Token** (optional, for advanced deployment)
  - Login to: https://hpanel.hostinger.com
  - Profile → API → Create Token
  - Save token securely

### 2️⃣ Set Environment Variables (2 minutes)

**On your Windows machine:**

```powershell
# Required for deployment
$env:HOSTINGER_VPS_IP="your-vps-ip-here"
$env:HOSTINGER_VPS_PASSWORD="your-root-password"

# Your existing API keys
$env:SUPABASE_URL="your-supabase-url"
$env:SUPABASE_KEY="your-supabase-key"
$env:GEMINI_API_KEY="your-gemini-api-key"
```

### 3️⃣ Deploy Backend to Hostinger (15 minutes)

**Option A: Automated Python Script (Recommended)**

```powershell
cd "c:\Users\db4sa\Desktop\ANTIGRAVITY\Voice recorder"
pip install paramiko
python deploy-hostinger.py
```

The script will:
- ✅ Connect to your VPS
- ✅ Install all dependencies
- ✅ Deploy your FastAPI backend
- ✅ Configure nginx + firewall
- ✅ Start the service

**Option B: Manual SSH Setup**

See [HOSTINGER_SETUP.md](./HOSTINGER_SETUP.md) for manual steps.

### 4️⃣ Deploy Frontend to Vercel (3 minutes)

**Option A: Windows Batch Script**

```powershell
.\deploy-vercel.bat
```

When prompted for environment variable:
- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** `http://YOUR_VPS_IP` (from step 1)

**Option B: Manual Vercel CLI**

```powershell
cd frontend
npm install -g vercel
vercel login
vercel
# Follow prompts
vercel env add NEXT_PUBLIC_API_URL production
# Paste: http://YOUR_VPS_IP
vercel --prod
```

### 5️⃣ Update Backend CORS (2 minutes)

SSH into your VPS:
```bash
ssh root@YOUR_VPS_IP
nano /var/www/voice-pdf-agent/backend/main.py
```

Find the CORS middleware and add your Vercel URL:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",  # ← Add this
    ],
    # ... rest
)
```

Save and restart:
```bash
sudo systemctl restart voice-pdf-agent
exit
```

---

## 🎉 You're Live!

Your app is now deployed:

- **Frontend:** https://your-app.vercel.app
- **Backend:** http://YOUR_VPS_IP
- **API Docs:** http://YOUR_VPS_IP/docs

---

## 🧪 Test Your Deployment

1. Visit your Vercel URL
2. Upload a PDF form
3. Record audio transcription
4. Check if filled PDF is generated
5. Download the filled PDF

---

## 🔧 Quick Commands Reference

### View Backend Logs
```bash
ssh root@YOUR_VPS_IP
sudo journalctl -u voice-pdf-agent -f
```

### Restart Backend
```bash
ssh root@YOUR_VPS_IP
sudo systemctl restart voice-pdf-agent
```

### Update Code
```bash
ssh root@YOUR_VPS_IP
cd /var/www/voice-pdf-agent
git pull origin main
sudo systemctl restart voice-pdf-agent
```

### Redeploy Frontend
```powershell
cd frontend
vercel --prod
```

---

## 📚 Detailed Guides

- **Hostinger Setup:** [HOSTINGER_SETUP.md](./HOSTINGER_SETUP.md)
- **Vercel Deployment:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **General Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Project Overview:** [README.md](./README.md)

---

## 💰 Total Cost

- Hostinger VPS: **~$5/month**
- Vercel: **Free**
- Supabase: **Free**
- Google Gemini: **Free tier**

**Total: ~$5/month for complete hosted app** 🎯

---

## ❓ Need Help?

1. Check [HOSTINGER_SETUP.md](./HOSTINGER_SETUP.md#troubleshooting) troubleshooting section
2. Review backend logs: `sudo journalctl -u voice-pdf-agent -n 50`
3. Check Vercel deployment logs in dashboard

---

**Ready to deploy? Start with Step 1!** 🚀
