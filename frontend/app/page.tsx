"use client";

import { useState } from "react";
import { API_BASE_URL } from "../lib/api";
import { DocumentList } from "../components/document-list";
import { RecordButton } from "../components/record-button";
import { NavBar } from "../components/nav-bar";
import { TranscriptionDisplay } from "../components/transcription-display";
import { ReviewPanel } from "../components/review-panel";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"record" | "documents" | "review">("record");
  const [transcriptionData, setTranscriptionData] = useState<any>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [activeFilename, setActiveFilename] = useState<string | null>(null);
  const [successFile, setSuccessFile] = useState<string | null>(null);

  const handleTranscriptionComplete = (data: any) => {
    setTranscriptionData(data);
    if (activeDocumentId) {
      // Automatically switch to review mode if we have a document selected
      //setActiveTab("review"); 
    }
  };

  const handleDocumentSelect = (docId: string, filename: string) => {
    setActiveDocumentId(docId);
    setActiveFilename(filename);
    setActiveTab("record"); // Switch to record once a doc is selected
    alert(`Selected: ${filename}. Now record your audio.`);
  };

  return (
    <main className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        {/* Record View */}
        <div
          className={`absolute inset-0 flex flex-col items-center p-6 transition-opacity duration-300 overflow-y-auto ${activeTab === 'record' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
        >
          <div className="text-center space-y-2 mt-8 mb-8 shrink-0">
            <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Voice Agent</h1>
            {activeFilename ? (
              <p className="text-blue-600 font-medium">Mapped to: {activeFilename}</p>
            ) : (
              <p className="text-slate-500">Go to Documents to select a PDF.</p>
            )}
          </div>

          <div className="w-full flex flex-col items-center shrink-0">
            <RecordButton onTranscriptionComplete={handleTranscriptionComplete} />
          </div>

          {/* Transcription Results Area */}
          <div className="w-full flex justify-center pb-20">
            {transcriptionData && (
              <div className="w-full flex flex-col items-center space-y-4">
                <TranscriptionDisplay data={transcriptionData} />
                {activeDocumentId && (
                  <button
                    onClick={() => setActiveTab("review")}
                    className="w-full max-w-lg py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-top-4"
                  >
                    <span>Start AI Mapping Review</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7-7-7"></path><path d="M19 12H5"></path></svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Documents View */}
        <div
          className={`absolute inset-0 flex flex-col p-6 space-y-4 transition-opacity duration-300 ${activeTab === 'documents' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
        >
          <h2 className="text-xl font-semibold mt-4">Your Documents</h2>
          <div className="flex-1 overflow-y-auto w-full pb-20">
            <DocumentList
              onSelect={handleDocumentSelect}
              activeDocumentId={activeDocumentId}
            />
          </div>
        </div>

        {/* Review View */}
        {activeTab === "review" && activeDocumentId && activeFilename && transcriptionData && (
          <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl my-auto">
              <ReviewPanel
                documentId={activeDocumentId}
                filename={activeFilename}
                transcriptionText={transcriptionData.full_text || ""}
                onCancel={() => setActiveTab("record")}
                onComplete={(finalData, filledFilename) => {
                  console.log("Final Polished Data:", finalData);
                  setSuccessFile(filledFilename);
                  setActiveTab("review"); // Keep review tab active behind the modal
                }}
              />
            </div>
          </div>
        )}

        {/* Success Modal */}
        {successFile && (
          <div className="absolute inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center space-y-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Success!</h2>
                <p className="text-slate-500 mt-2">Your PDF has been generated and is ready for download.</p>
              </div>

              <div className="space-y-3">
                <a
                  href={`${API_BASE_URL}/download/${successFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all transform hover:-translate-y-0.5"
                >
                  <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download PDF
                </a>

                <button
                  onClick={() => {
                    setSuccessFile(null);
                    setActiveTab("documents");
                    setActiveDocumentId(null);
                    setActiveFilename(null);
                    setTranscriptionData(null);
                  }}
                  className="w-full py-4 text-slate-500 font-semibold hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <NavBar activeTab={activeTab === "review" ? "record" : activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}
