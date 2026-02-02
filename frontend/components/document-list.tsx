"use client";

import { useState, useEffect } from "react";
import { api, API_BASE_URL } from "../lib/api";
import { TemplateWizard } from "./template-wizard";

type Doc = {
    id: string;
    filename: string;
    status?: "uploaded" | "processing" | "ready";
    created_at?: string;
    is_filled?: boolean;
};

interface DocumentListProps {
    onSelect?: (id: string, filename: string, shouldRedirect?: boolean) => void;
    activeDocumentId?: string | null;
    isActive?: boolean;
    filter?: 'all' | 'input' | 'completed';
}

export function DocumentList({ onSelect, activeDocumentId, isActive = false, filter = 'all' }: DocumentListProps) {
    const [documents, setDocuments] = useState<Doc[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [wizardFilename, setWizardFilename] = useState<string | null>(null);

    // Fetch documents on mount or when active
    useEffect(() => {
        if (isActive) {
            fetchDocuments();
        }
    }, [isActive]);

    const fetchDocuments = async () => {
        try {
            setIsLoading(true);
            const docs = await api.getDocuments();
            setDocuments(docs);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
            // Optionally clear documents or show an error state
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setIsUploading(true);
        const file = e.target.files[0];

        try {
            const result = await api.uploadDocument(file);
            console.log("Upload result:", result);
            await fetchDocuments(); // Refresh the list

            // Trigger Wizard if it's a Word doc with no tags
            const isWord = file.name.toLowerCase().endsWith(".docx") || file.name.toLowerCase().endsWith(".doc");
            if (isWord && result.fields_count === 0) {
                setWizardFilename(result.filename);
            } else {
                onSelect?.(result.document_id, result.filename, false);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const handleDelete = async (docId: string, filename: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${filename}"? This cannot be undone.`)) {
            try {
                await api.deleteDocument(docId);
                // Optimize: Remove locally first for speed, then fetch
                setDocuments(docs => docs.filter(d => d.id !== docId));
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete document");
            }
        }
    };

    const handleShare = async (filename: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(`${API_BASE_URL}/download/${filename}`);
            const blob = await response.blob();
            const mimeType = filename.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            const file = new File([blob], filename, { type: mimeType });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: filename,
                    text: 'Generated via Voice to PDF AI',
                });
            } else {
                await navigator.share({
                    title: filename,
                    url: `${API_BASE_URL}/download/${filename}`
                });
            }
        } catch (error) {
            console.error('Error sharing document:', error);
            window.open(`${API_BASE_URL}/download/${filename}`, '_blank');
        }
    };

    const filteredDocuments = documents.filter(doc => {
        if (filter === 'all') return true;
        if (filter === 'input') return !doc.filename.startsWith('filled_');
        if (filter === 'completed') return doc.filename.startsWith('filled_');
        return true;
    });

    if (isLoading) {
        return (
            <div className="w-full h-64 glass-panel flex items-center justify-center border-white/5">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <div className="text-slate-400 font-medium tracking-widest uppercase text-xs animate-pulse">Syncing Vault...</div>
                </div>
            </div>
        );
    }

    if (filteredDocuments.length === 0) {
        if (filter === 'completed') {
            return (
                <div className="w-full py-16 glass-card border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 gap-4 bg-white/0">
                    <div className="p-4 rounded-full bg-slate-800/50 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-slate-300">No output logs yet</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Generate filled PDFs from the session tab</p>
                    </div>
                </div>
            );
        }

        return (
            <div id="vault-upload" className="w-full py-16 glass-card border-dashed border-white/10 flex flex-col items-center justify-center text-slate-400 gap-6 relative overflow-hidden group hover:bg-white/[0.02] transition-all cursor-pointer">
                <input
                    type="file"
                    accept=".pdf,.docx,.doc,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                </div>
                {isUploading ? (
                    <div className="text-center space-y-2">
                        <div className="text-blue-400 font-bold tracking-widest uppercase text-xs animate-pulse">Uploading Document</div>
                        <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 animate-progress" style={{ width: '60%' }} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="font-bold text-slate-200">The vault is currently empty</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Tap to upload your first template</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {filter === 'input' && (
                <label className="group block w-full text-center p-4 border-2 border-dashed border-white/5 rounded-2xl text-slate-400 text-sm cursor-pointer hover:bg-white/[0.02] hover:border-blue-500/20 transition-all">
                    <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span className="font-semibold">{isUploading ? "Uploading..." : "ADD NEW TEMPLATE"}</span>
                    </div>
                    <input
                        type="file"
                        accept=".pdf,.docx,.doc,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleUpload}
                        disabled={isUploading}
                        className="hidden"
                    />
                </label>
            )}
            <div className="w-full space-y-4">
                {filteredDocuments.map((doc, index) => (
                    <div
                        key={doc.id}
                        id={index === 0 ? "tour-vault-doc-0" : undefined}
                        className={`group relative overflow-hidden glass-card p-5 border transition-all duration-300 ${doc.is_filled
                            ? 'border-green-500/20 hover:border-green-500/40 bg-green-500/5'
                            : 'border-white/5 hover:border-white/20 hover:bg-white/5 shadow-lg'
                            }`}
                    >
                        {/* Selected Indicator */}
                        {activeDocumentId === doc.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                        )}

                        <div className="flex items-center gap-5">
                            {/* File Icon */}
                            <div className={`p-3 rounded-2xl ${doc.is_filled ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-400'
                                }`}>
                                {doc.filename.toLowerCase().endsWith('.pdf') ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <path d="M9 12h6"></path>
                                        <path d="M9 16h6"></path>
                                    </svg>
                                )}
                            </div>

                            {/* Content */}
                            <div
                                onClick={() => onSelect?.(doc.id, doc.filename, true)}
                                className="flex-1 min-w-0 cursor-pointer"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`truncate font-bold text-sm tracking-tight ${doc.is_filled ? 'text-green-400' : 'text-slate-100'
                                        }`}>
                                        {doc.filename}
                                    </h3>
                                    {doc.is_filled && (
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-black rounded-sm uppercase tracking-tighter border border-green-500/30">
                                            LOCKED
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {doc.created_at && (
                                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                            {new Date(typeof doc.created_at === 'number' ? doc.created_at * 1000 : doc.created_at).toLocaleDateString()}
                                        </span>
                                    )}
                                    <span className="h-1 w-1 rounded-full bg-slate-700" />
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                        {doc.filename.toLowerCase().endsWith('.pdf') ? 'PDF ASSET' : 'WORD ASSET'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <a
                                    href={`${API_BASE_URL}/download/${doc.filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2.5 rounded-xl transition-all duration-300 shadow-xl ${doc.is_filled
                                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                        : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 shadow-blue-500/10'
                                        }`}
                                    onClick={(e) => e.stopPropagation()}
                                    title="View Template"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </a>
                                {doc.is_filled && (
                                    <button
                                        onClick={(e) => handleShare(doc.filename, e)}
                                        className="p-2.5 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all duration-300"
                                        title="Share Asset"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                                    </button>
                                )}
                                <button
                                    onClick={(e) => handleDelete(doc.id, doc.filename, e)}
                                    className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all duration-300"
                                    title="Purge Document"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Template Wizard Modal Overlay */}
            {wizardFilename && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl transform transition-all">
                        <TemplateWizard
                            filename={wizardFilename}
                            onComplete={(id, name) => {
                                setWizardFilename(null);
                                fetchDocuments();
                                onSelect?.(id, name);
                            }}
                            onCancel={() => setWizardFilename(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
