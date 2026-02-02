 # Voice to PDF AI: Project Progress & Handover Summary

This document serves as the high-level source of truth for the project's current state, architectural decisions, and recent fixes. It is designed to bring subsequent agents up to speed immediately.

## 🚀 Project Overview
A neural document synthesis platform that transforms voice transcriptions into structured documents (PDF/Word) using AI-driven field mapping.

### Tech Stack
- **Frontend**: Next.js (App Router), TailwindCSS, Supabase Auth/Client.
- **Backend**: FastAPI (Python), Google Gemini v1.5 Pro/Flash, `pypdf` (PDF processing), `python-docx` / `docxtpl` (Word processing).
- **Database**: Supabase (PostgreSQL with RLS).

---

## ✅ Core Features Implemented

### 1. Document Vault & Upload
- **Multiformat Support**: Supports `.pdf` and `.docx`.
- **Legacy Awareness**: Backend specifically detects legacy `.doc` files and advises conversion to `.docx` for AI features.
- **RLS Secured**: Documents are filtered by `user_id` via Supabase Row Level Security.

### 2. Voice Transcription Protocol
- **Record View**: Premium orbital animation UI with real-time feedback.
- **Saved Recordings (NEW)**: Automatic local mirroring of every recording to **IndexedDB** on the device. Prevents data loss during API failures or session timeouts.
- **Recovery UI**: Allows users to play back recordings instantly, download raw `.wav` files, or retry transcriptions from local storage.

### 3. AI Template Wizard (Word docs)
- **Structure Analysis**: Extracts fields from paragraphs and **tables** (recently enhanced).
- **Smart Mapping**: Heuristically identifies potential fields and suggests `{{tag_names}}`.
- **In-place Transformation**: Automatically rewrites the Word document structure to include detected tags while preserving styling/runs.

### 4. Semantic Review & Deployment
- **Review Panel**: High-fidelity UI for verifying AI mappings before final generation.
- **Confidence Scoring**: Each mapping includes an AI-generated reliability score and reasoning log.
- **Dynamic Assets**: Automatically generates the final "filled" document as either PDF or Word, maintaining naming conventions and downloadability.

---

## 🛠️ Recent Critical Fixes (Phase 14)
- **Wizard Trigger Robustness**: Fixed logic where the Wizard was bypassed for certain Word formats. Now handles `.docx` and `.DOCX` case-insensitively and detects fields inside table structures.
- **Status UI Alignment**: Corrected `translateY` CSS logic for the "Protocol Log" animations. Status updates now transition smoothly.
- **Progress Feedback**: Connected formerly hardcoded loading bars to the actual `progress` state in `ReviewPanel` and `TemplateWizard`.
- **Visual Clarity**: 
    - Removed confusing "Checkmark" icons from un-processed Word docs in the vault.
    - Updated success modals to correctly label assets as "Word Doc" or "PDF" dynamically.
- **Phase 15 (Saved Recordings)**: Implemented `audio-storage.ts` and `LocalBackups.tsx` to ensure 100% data safety via persistent device-side storage, complete with in-page playback.
- **Phase 16 (Interactive UX & Hydration Fix)**: 
    - **Step Card Expansion**: Implemented interactive "Step" cards on the home page with smooth animations and detailed instructions.
    - **Hydration Mismatch Resolution**: Corrected invalid HTML tag nesting and resolved font-related hydration errors, achieving a clean dev console.
- **Mobile Share Fix**: Corrected Mime types for Word documents when shared via the `navigator.share` API.

---

## 📂 Key File Map
- **Frontend**:
  - `app/page.tsx`: Main navigation and state orchestration.
  - `components/document-list.tsx`: The "Vault" with upload and selection logic.
  - `components/template-wizard.tsx`: Logic for AI field extraction and Word transformation.
  - `components/review-panel.tsx`: The "Intelligence" layer for mapping transcriptions to fields.
- **Backend**:
  - `main.py`: FastAPI endpoints and route orchestration.
  - `services/doc_service.py`: Word document manipulation (The "Engine").
  - `services/llm_service.py`: Gemini integration and prompt engineering.

---

## 💡 Notes for Future Agents
- **Word Transformation**: The `doc_service` uses `python-docx` and `docxtpl`. When replacing text, it logic-falls-back to paragraph replacement if internal "runs" are too complex to preserve individually.
- **Ports**: Backend defaults to port `8000`, Frontend to `3000`.
- **Auth**: Supabase Auth is enabled; insure the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured in `.env.local`.

---
*Last Updated: February 2, 2026*
