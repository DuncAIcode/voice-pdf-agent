# 🚀 Hostinger VPS Setup Guide

Complete guide to deploying your FastAPI backend on Hostinger VPS with automated deployment.

---

## 📋 Table of Contents

1. [Hostinger VPS Signup](#step-1-hostinger-vps-signup)
2. [Get API Access Token](#step-2-get-api-access-token)
3. [Initial VPS Setup](#step-3-initial-vps-setup)
4. [Automated Deployment](#step-4-automated-deployment)
5. [Connect to Vercel Frontend](#step-5-connect-to-vercel-frontend)
6. [Maintenance & Updates](#maintenance--updates)

---

## Step 1: Hostinger VPS Signup

### 1.1 Choose Your Plan

Visit: **https://www.hostinger.com/vps-hosting**

**Recommended Plan:**
- **KVM 1** - ~$4.99/month (on sale)
  - 1 vCPU Core
  - 4 GB RAM
  - 50 GB NVMe Storage
  - 1 TB Bandwidth
  - **Perfect for this project!**

### 1.2 Complete Registration

1. Click **"Get Started"** on KVM 1 plan
2. Create Hostinger account or login
3. Choose billing cycle:
   - **12 months** - Best value (~$4.99/month)
   - 24/48 months - Deeper discounts
4. Complete payment
5. Wait 5-10 minutes for VPS provisioning

### 1.3 Access Your VPS

You'll receive an email with:
- ✅ VPS IP address
- ✅ Root password
- ✅ SSH access details

---

## Step 2: Get API Access Token

### 2.1 Access Hostinger Panel

1. Go to: **https://hpanel.hostinger.com**
2. Login with your credentials
3. Navigate to **VPS** section

### 2.2 Generate API Token

1. Click your profile icon (top-right)
2. Select **"API"** or **"Developers"**
3. Click **"Create API Token"**
4. Name it: `voice-pdf-deployment`
5. **Copy the token immediately** (shown only once!)
6. Save it securely

Example token format:
```
hapi_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2.3 Get Your VPS ID

In the Hostinger panel:
1. Go to **VPS** section
2. Note your **VPS ID** (e.g., `1268054`)
3. Note your **VPS IP address** (e.g., `123.45.67.89`)

---

## Step 3: Initial VPS Setup

### 3.1 SSH Into Your VPS

**From Windows (PowerShell or Git Bash):**
```powershell
ssh root@YOUR_VPS_IP
# Enter password from email
```

**First-time connection:**
```bash
# When prompted "Are you sure you want to continue connecting?"
# Type: yes
```

### 3.2 Run Initial System Update

```bash
# Update package lists
apt update && apt upgrade -y

# Install essential tools
apt install -y git curl wget nano htop
```

### 3.3 Create Deployment User (Optional but Recommended)

```bash
# Create non-root user
adduser deploy
usermod -aG sudo deploy

# Switch to deploy user
su - deploy
```

---

## Step 4: Automated Deployment

### 4.1 Prepare Local Environment

**On your Windows machine:**

```powershell
cd "c:\Users\db4sa\Desktop\ANTIGRAVITY\Voice recorder"

# Set environment variables
$env:HOSTINGER_API_TOKEN="your-api-token-here"
$env:HOSTINGER_VPS_ID="your-vps-id-here"
$env:HOSTINGER_VPS_IP="your-vps-ip-here"
```

### 4.2 Run Automated Deployment Script

**Option A: PowerShell Script (Windows)**
```powershell
.\deploy-hostinger.ps1
```

**Option B: Python Script (Cross-platform)**
```powershell
pip install hostinger-api paramiko
python deploy-hostinger.py
```

### 4.3 What the Script Does

The automated script will:

1. ✅ **Connect to your VPS via SSH**
2. ✅ **Install Python 3.11 + pip**
3. ✅ **Install nginx (reverse proxy)**
4. ✅ **Clone your GitHub repository**
5. ✅ **Install backend dependencies**
6. ✅ **Configure environment variables**
7. ✅ **Set up systemd service** (keeps app running)
8. ✅ **Configure nginx** (port 80/443 forwarding)
9. ✅ **Install SSL certificate** (Let's Encrypt)
10. ✅ **Start your FastAPI backend**

---

## Step 5: Connect to Vercel Frontend

### 5.1 Get Your Backend URL

After deployment, your backend will be available at:
```
https://YOUR_VPS_IP
# or if you have a domain:
https://api.yourdomain.com
```

### 5.2 Update Vercel Environment Variable

**Option A: Vercel Dashboard**
1. Go to https://vercel.com
2. Select your project: `voice-pdf-agent`
3. Settings → Environment Variables
4. Add/Update:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://YOUR_VPS_IP:8000` (or your domain)
   - **Environment:** Production
5. Click **Save**
6. Redeploy: Deployments → Click ⋯ → Redeploy

**Option B: Vercel CLI**
```powershell
cd frontend
vercel env add NEXT_PUBLIC_API_URL production
# Paste: http://YOUR_VPS_IP:8000
vercel --prod
```

### 5.3 Update Backend CORS

SSH into your VPS:
```bash
ssh root@YOUR_VPS_IP
cd /var/www/voice-pdf-agent/backend
nano main.py
```

Update CORS origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Restart the service:
```bash
sudo systemctl restart voice-pdf-agent
```

---

## Maintenance & Updates

### Deploy Code Updates

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP

# Navigate to app directory
cd /var/www/voice-pdf-agent

# Pull latest changes
git pull origin main

# Restart backend
sudo systemctl restart voice-pdf-agent

# Check status
sudo systemctl status voice-pdf-agent
```

### View Logs

```bash
# Application logs
sudo journalctl -u voice-pdf-agent -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Update Dependencies

```bash
cd /var/www/voice-pdf-agent/backend
source venv/bin/activate
pip install -r requirements.txt --upgrade
sudo systemctl restart voice-pdf-agent
```

---

## 🔧 Troubleshooting

### Backend Not Starting

```bash
# Check service status
sudo systemctl status voice-pdf-agent

# View detailed logs
sudo journalctl -u voice-pdf-agent -n 50

# Restart service
sudo systemctl restart voice-pdf-agent
```

### Port Already in Use

```bash
# Find process using port 8000
sudo lsof -i :8000

# Kill the process
sudo kill -9 PID
```

### Frontend Can't Connect to Backend

1. **Check firewall:**
   ```bash
   sudo ufw status
   sudo ufw allow 8000
   ```

2. **Check nginx:**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

3. **Verify environment variables in Vercel**

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Restart nginx
sudo systemctl restart nginx
```

---

## 📊 Cost Breakdown

| Service | Cost | Purpose |
|---------|------|---------|
| **Hostinger VPS** | ~$5/month | Backend hosting |
| **Vercel** | Free | Frontend hosting |
| **Supabase** | Free | Database |
| **Google Gemini** | Free tier | AI transcription |
| **Total** | **~$5/month** | Complete app |

---

## 🎯 Quick Reference

### Important Paths

```bash
# App directory
/var/www/voice-pdf-agent

# Backend code
/var/www/voice-pdf-agent/backend

# Environment file
/var/www/voice-pdf-agent/backend/.env

# Systemd service
/etc/systemd/system/voice-pdf-agent.service

# Nginx config
/etc/nginx/sites-available/voice-pdf-agent
```

### Important Commands

```bash
# Restart backend
sudo systemctl restart voice-pdf-agent

# View logs
sudo journalctl -u voice-pdf-agent -f

# Update code
cd /var/www/voice-pdf-agent && git pull && sudo systemctl restart voice-pdf-agent

# Check nginx
sudo nginx -t && sudo systemctl restart nginx
```

---

## 🚀 Next Steps

1. **Sign up for Hostinger VPS** → https://www.hostinger.com/vps-hosting
2. **Get API token** from Hostinger panel
3. **Run automated deployment script** (see Step 4)
4. **Update Vercel environment variable** (see Step 5)
5. **Test your live app!**

---

## 📞 Support

- **Hostinger Support:** https://www.hostinger.com/contact
- **Deployment Script Issues:** Check [deploy-hostinger.py](./deploy-hostinger.py)
- **General Setup:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Ready to automate?** Run the deployment scripts after completing signup! 🎉
