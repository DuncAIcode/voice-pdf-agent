"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../lib/api";
import { DocumentList } from "../components/document-list";
import { RecordButton } from "../components/record-button";
import { NavBar } from "../components/nav-bar";
import { TranscriptionDisplay } from "../components/transcription-display";
import { ReviewPanel } from "../components/review-panel";
import { LocalBackups } from "../components/local-backups";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"record" | "documents" | "completed" | "review">("record");
  const [transcriptionData, setTranscriptionData] = useState<any>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [activeFilename, setActiveFilename] = useState<string | null>(null);
  const [successFile, setSuccessFile] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        setIsChecking(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        setIsChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);
  if (isChecking) {
    return <div className="h-full flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div></div>;
  }

  const handleTranscriptionComplete = (data: any) => {
    setTranscriptionData(data);
  };

  const handleShare = async (filename: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/download/${filename}`);
      const blob = await response.blob();
      const mimeType = filename.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const file = new File([blob], filename, { type: mimeType });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: filename,
          text: 'Generated via Voice to PDF AI',
        });
      } else {
        // Fallback for browsers that support sharing links but not files
        await navigator.share({
          title: filename,
          url: `${API_BASE_URL}/download/${filename}`
        });
      }
    } catch (error) {
      console.error('Error sharing document:', error);
      // Fallback: trigger a normal download if sharing fails
      window.open(`${API_BASE_URL}/download/${filename}`, '_blank');
    }
  };

  const handleDocumentSelect = (docId: string, filename: string, shouldRedirect: boolean = true) => {
    setActiveDocumentId(docId);
    setActiveFilename(filename);
    if (shouldRedirect) {
      setActiveTab("record");
    }
  };

  return (
    <main className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 relative overflow-hidden">
        {/* Record View */}
        <div
          className={`absolute inset-0 flex flex-col items-center p-6 transition-all duration-500 overflow-y-auto ${activeTab === 'record' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 z-0 pointer-events-none'
            }`}
        >
          <div className="text-center space-y-4 mt-8 mb-16 shrink-0 animate-in fade-in slide-in-from-top-8 duration-1000">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
              Voice to <span className="text-gradient">PDF</span> AI
            </h1>
            <p className="text-slate-500 text-base font-medium max-w-xs mx-auto leading-relaxed">
              Neural document synthesis for the modern enterprise.
            </p>

            {activeFilename ? (
              <div className="mt-6 px-5 py-2.5 glass-card inline-flex items-center space-x-3 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-110">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></span>
                <p className="text-blue-400 text-sm font-bold tracking-wide uppercase">{activeFilename}</p>
              </div>
            ) : (
              <div className="w-full max-w-lg mx-auto grid grid-cols-3 gap-3 mt-12 px-2 items-start">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandedStep(expandedStep === step ? null : step)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setExpandedStep(expandedStep === step ? null : step);
                      }
                    }}
                    className={`glass-panel p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 border-white/5 bg-white/[0.02] group hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden text-center cursor-pointer ${expandedStep === step ? 'scale-[1.02] bg-white/[0.06] border-white/10 ring-1 ring-white/10' : ''
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 ${expandedStep === step ? 'scale-110 mb-1' : 'group-hover:scale-110'
                      } ${step === 1 ? 'bg-blue-500/10 text-blue-400' :
                        step === 2 ? 'bg-purple-500/10 text-purple-400' :
                          'bg-yellow-500/10 text-yellow-500'
                      }`}>
                      {step === 1 && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v6m-3-3h6m-3-10a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2Z" /></svg>}
                      {step === 2 && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>}
                      {step === 3 && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14l-2 2-2-2M12 11V3m0 18v-5" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M21 5c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M21 19c0 1.66-4 3-9 3s-9-1.34-9-3" /></svg>}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Step {step}</span>
                    <span className="text-xs font-bold text-slate-200">
                      {step === 1 ? 'Vault & Upload' : step === 2 ? 'Record Narrative' : 'AI Magic'}
                    </span>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedStep === step ? 'max-h-40 opacity-100 mt-3 border-t border-white/5 pt-3' : 'max-h-0 opacity-0'
                      }`}>
                      <p className="text-[10px] font-medium leading-relaxed text-slate-400 px-1">
                        {step === 1 && "Select a Word or PDF template. Our AI parses placeholders automatically to prepare for your voice data."}
                        {step === 2 && "Tap the pulse and speak naturally. Dictate the document details in any order—our AI understands context."}
                        {step === 3 && "View the synthesized mapping, make optional edits, and export your professional document in one click."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full flex flex-col items-center shrink-0">
            <RecordButton onTranscriptionComplete={handleTranscriptionComplete} />
            <LocalBackups onRetrySuccess={handleTranscriptionComplete} />
          </div>

          {/* Transcription Results Area */}
          <div className="w-full flex justify-center pb-24 mt-8">
            {transcriptionData && (
              <div className="w-full flex flex-col items-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <TranscriptionDisplay data={transcriptionData} />
                {activeDocumentId && (
                  <button
                    onClick={() => setActiveTab("review")}
                    className="w-full max-w-lg py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-3 group"
                  >
                    <span>Proceed to AI Mapping</span>
                    <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7-7-7"></path><path d="M19 12H5"></path></svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Documents View */}
        <div
          className={`absolute inset-0 flex flex-col p-6 space-y-6 transition-all duration-500 ${activeTab === 'documents' || activeTab === 'completed' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 z-0 pointer-events-none'
            }`}
        >
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              {activeTab === 'completed' ? 'Archive' : 'Workflows'}
            </h2>
            <p className="text-slate-500 text-sm">
              {activeTab === 'completed' ? 'View and download previously processed documents.' : 'Select a PDF template for AI processing.'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto w-full pb-20">
            <DocumentList
              onSelect={activeTab === 'documents' ? handleDocumentSelect : undefined}
              activeDocumentId={activeDocumentId}
              isActive={activeTab === 'documents' || activeTab === 'completed'}
              filter={activeTab === 'completed' ? 'completed' : 'input'}
            />
          </div>
        </div>

        {/* Review View */}
        {activeTab === "review" && activeDocumentId && activeFilename && transcriptionData && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full h-full max-w-2xl py-8">
              <ReviewPanel
                documentId={activeDocumentId}
                filename={activeFilename}
                transcriptionText={transcriptionData.full_text || ""}
                onCancel={() => setActiveTab("record")}
                onComplete={(finalData, filledFilename) => {
                  setSuccessFile(filledFilename);
                }}
              />
            </div>
          </div>
        )}

        {/* Success Modal */}
        {successFile && (
          <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="glass-panel p-10 rounded-[2.5rem] border-white/10 shadow-3xl max-w-sm w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full"></div>
                <div className="relative w-24 h-24 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white">Document Ready</h2>
                <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                  AI mapping successfully verified. Your {successFile?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Word doc'} is prepared for enterprise use.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href={`${API_BASE_URL}/download/${successFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-5 bg-white text-slate-950 font-bold rounded-2xl shadow-xl hover:bg-slate-100 transition-all transform active:scale-[0.98]"
                >
                  <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download {successFile?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Word Doc'}
                </a>

                <button
                  onClick={() => handleShare(successFile)}
                  className="flex items-center justify-center w-full py-5 glass-panel text-white font-bold rounded-2xl border-white/10 hover:bg-white/10 transition-all transform active:scale-[0.98]"
                >
                  <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                  Share Document
                </button>

                <button
                  onClick={() => {
                    setSuccessFile(null);
                    setActiveTab("documents");
                    setActiveDocumentId(null);
                    setActiveFilename(null);
                    setTranscriptionData(null);
                  }}
                  className="w-full py-4 text-slate-400 font-semibold hover:text-white transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <NavBar activeTab={activeTab === "review" ? "record" : activeTab} setActiveTab={setActiveTab} />

      {/* Floating Action Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none z-[100]">
        <div className="pointer-events-auto">
          {/* Logo or placeholder can go here if needed, or just keep it simple */}
        </div>
        <button
          onClick={async () => {
            const confirmed = confirm("Are you sure you want to sign out?");
            if (confirmed) {
              await supabase.auth.signOut();
              router.push("/login");
            }
          }}
          className="pointer-events-auto w-10 h-10 glass-panel rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all group"
          title="Sign Out"
        >
          <svg className="group-hover:-translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>
    </main>
  );
}
