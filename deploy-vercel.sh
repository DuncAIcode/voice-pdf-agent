#!/bin/bash

# Vercel CLI Deployment Script
# This script automates the deployment of the PDF Automation Agent frontend to Vercel
# Based on Vercel documentation from Context7

echo "🚀 Starting Vercel Frontend Deployment..."
echo ""

# Step 1: Install Vercel CLI globally
echo "📦 Installing Vercel CLI..."
npm install --global vercel@latest

# Step 2: Navigate to frontend directory
cd frontend || { echo "❌ Error: frontend directory not found"; exit 1; }

# Step 3: Login to Vercel (will open browser)
echo ""
echo "🔐 Logging in to Vercel..."
echo "This will open a browser window for authentication."
vercel login

# Step 4: Link project to Vercel (interactive)
echo ""
echo "🔗 Linking project to Vercel..."
echo "When prompted:"
echo "  - Select your Vercel account/team"
echo "  - Create new project or link existing"
echo "  - Project name: voice-pdf-agent"
vercel link

# Step 5: Set environment variables
echo ""
echo "⚙️ Setting environment variables..."
echo "Enter your backend URL (e.g., https://your-backend.railway.app):"
read BACKEND_URL

vercel env add NEXT_PUBLIC_API_URL production <<EOF
$BACKEND_URL
EOF

vercel env add NEXT_PUBLIC_API_URL preview <<EOF
$BACKEND_URL
EOF

# Step 6: Deploy to production
echo ""
echo "🚀 Deploying to Vercel production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "Your app is now live on Vercel."
echo ""
echo "To deploy future updates:"
echo "  cd frontend"
echo "  vercel --prod"
