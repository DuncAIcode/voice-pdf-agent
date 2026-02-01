"use client";

import { useState, useEffect } from "react";
import { api, API_BASE_URL } from "../lib/api";

type Doc = {
    id: string;
    filename: string;
    status?: "uploaded" | "processing" | "ready";
    created_at?: string;
    is_filled?: boolean;
};

interface DocumentListProps {
    onSelect?: (id: string, filename: string) => void;
    activeDocumentId?: string | null;
    isActive?: boolean;
}

export function DocumentList({ onSelect, activeDocumentId, isActive = false }: DocumentListProps) {
    const [documents, setDocuments] = useState<Doc[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
            const result = await api.uploadPDF(file);
            console.log("Upload result:", result);
            await fetchDocuments(); // Refresh the list
            onSelect?.(result.document_id, result.filename);
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

    if (isLoading) {
        return (
            <div className="w-full h-48 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-400">
                <div className="animate-pulse">Loading documents...</div>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="w-full h-48 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 relative overflow-hidden bg-slate-50 hover:bg-slate-100 transition-colors">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                {isUploading ? (
                    <div className="animate-pulse">Uploading...</div>
                ) : (
                    <>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span>No documents yet</span>
                        <span className="text-xs text-slate-300">Tap to upload a PDF</span>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <label className="block w-full text-center p-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm cursor-pointer hover:bg-slate-50">
                {isUploading ? "Uploading..." : "Upload another PDF"}
                <input type="file" accept=".pdf" onChange={handleUpload} disabled={isUploading} className="hidden" />
            </label>
            <ul className="w-full space-y-3">
                {documents.map((doc) => (
                    <li
                        key={doc.id}
                        className={`p-4 rounded-xl border transition-all ${doc.is_filled
                            ? 'bg-green-50 border-green-200 shadow-sm'
                            : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div
                                onClick={() => onSelect?.(doc.id, doc.filename)}
                                className="flex items-center space-x-3 flex-1 cursor-pointer"
                            >
                                <div className={`p-2 rounded-lg ${doc.is_filled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`truncate font-medium block ${doc.is_filled ? 'text-green-700' : 'text-slate-700'
                                            }`}>
                                            {doc.filename}
                                        </span>
                                        {doc.is_filled && (
                                            <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase whitespace-nowrap">
                                                Filled
                                            </span>
                                        )}
                                    </div>
                                    {doc.created_at && (
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                            {new Date(typeof doc.created_at === 'number' ? doc.created_at * 1000 : doc.created_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <a
                                href={`${API_BASE_URL}/download/${doc.filename}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${doc.is_filled
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    View
                                </span>
                            </a>
                            <button
                                onClick={(e) => handleDelete(doc.id, doc.filename, e)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                title="Delete Document"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
