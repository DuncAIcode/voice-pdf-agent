@echo off
REM Vercel CLI Deployment Script for Windows
REM This script automates the deployment of the PDF Automation Agent frontend to Vercel
REM Based on Vercel documentation from Context7

echo 🚀 Starting Vercel Frontend Deployment...
echo.

REM Step 1: Install Vercel CLI globally
echo 📦 Installing Vercel CLI...
call npm install --global vercel@latest

REM Step 2: Navigate to frontend directory
cd frontend
if errorlevel 1 (
    echo ❌ Error: frontend directory not found
    exit /b 1
)

REM Step 3: Login to Vercel
echo.
echo 🔐 Logging in to Vercel...
echo This will open a browser window for authentication.
call vercel login

REM Step 4: Link project to Vercel
echo.
echo 🔗 Linking project to Vercel...
echo When prompted:
echo   - Select your Vercel account/team
echo   - Create new project or link existing
echo   - Project name: voice-pdf-agent
call vercel link

REM Step 5: Deploy to production
echo.
echo 🚀 Deploying to Vercel production...
call vercel --prod

echo.
echo ✅ Deployment complete!
echo Your app is now live on Vercel.
echo.
echo To set environment variables, run:
echo   vercel env add NEXT_PUBLIC_API_URL production
echo.
echo To deploy future updates:
echo   cd frontend
echo   vercel --prod

pause
