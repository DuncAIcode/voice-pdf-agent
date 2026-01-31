# 🎯 PDF Automation Agent

Mobile-first PWA for automating PDF form filling using AI-powered voice transcription.

## ✨ Features

- 🎤 **Voice Recording** - Record meetings with real-time audio visualization
- 📄 **PDF Upload** - Automatic form field extraction
- 🤖 **AI Transcription** - Powered by Google Gemini
- 🧠 **Smart Mapping** - Intelligent transcript-to-field mapping
- ✅ **Review Interface** - Manual override and validation
- 📱 **Mobile-First** - Optimized for touch devices
- 🔒 **Secure** - Row-level security with Supabase

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide Icons** - UI icons

### Backend
- **FastAPI** - Python web framework
- **Google Gemini AI** - Transcription & LLM
- **PyMuPDF** - PDF processing
- **Supabase** - Database & auth

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Supabase account
- Google AI API key

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/voice-pdf-agent.git
cd voice-pdf-agent
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run server
python -m uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📦 Environment Variables

### Backend (.env)
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🗄️ Database Setup

1. Create a new Supabase project
2. Run the SQL schema:
```bash
# Execute backend/schema.sql in Supabase SQL editor
```

## 📱 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy

### Backend (Railway/Render)
1. Create new service
2. Connect GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

## 📚 Documentation

- [MASTER_PLAN.md](./MASTER_PLAN.md) - Complete development history
- [task.md](./task.md) - Development checklist
- [instructions.md](./instructions.md) - Original requirements

## 🎯 Workflow

1. **Record** - Capture meeting audio
2. **Upload** - Submit PDF template
3. **Transcribe** - AI converts speech to text
4. **Map** - Smart field matching
5. **Review** - Validate suggestions
6. **Generate** - Create filled PDF
7. **Download** - Access completed form

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📞 Support

For issues and questions, please open a GitHub issue.

---

**Status:** ✅ Production-ready MVP  
**Version:** 1.0.0  
**Last Updated:** January 2026
