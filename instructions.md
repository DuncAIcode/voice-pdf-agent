### MASTER TASK: MOBILE-FIRST PDF AUTOMATION AGENT ###

OBJECTIVE:
Build a PWA-ready web application that automates PDF form filling via meeting transcriptions. 
Stack: Next.js (Mobile UI), Supabase (Auth/DB/Storage), FastAPI/Python (PDF/AI processing).

STAGING & ARCHITECTURE:
1. UI: Create a mobile-first interface using Tailwind. Focus on a large-target "Record" button and a document dashboard.
2. DATABASE: Implement a Supabase schema for 'documents', 'form_fields', and 'transcriptions'.
3. PDF SERVICE: Build a Python utility to extract /AcroForm field names from uploaded PDFs.
4. AUDIO SERVICE: Implement WhisperX with speaker diarization to separate meeting participants.
5. INTEGRATION: Use an LLM to map transcription insights to the identified PDF fields and generate a filled PDF download.

REFINED SUCCESS CRITERIA:
- The system must successfully extract "Field Keys" from a standard fillable PDF.
- The transcription must differentiate between at least two distinct speakers.
- The final output must be a downloadable, correctly populated PDF document.
- UI must pass a mobile responsiveness check (390px width).

INSTRUCTIONS FOR AGENT:
- Start by generating an "Implementation Plan" for the PDF scraping logic and Supabase integration.
- Use 'Planning Mode' to verify the dependencies for WhisperX and ffmpeg before installation.
- Provide a browser recording of the mobile UI flow once the frontend is scaffolded.

AGENT BEHAVIOR RULES:
- **Autonomous Terminal/SSH Work**: Do NOT ask the user to run terminal commands or SSH into servers manually. Always attempt to perform these actions yourself using the available tools (`run_command`, `ssh`, etc.). Only ask the user if you are strictly blocked by missing credentials.