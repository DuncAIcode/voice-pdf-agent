"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";

interface MappingMetadata {
    confidence: number;
    reasoning: string;
    is_ambiguous: boolean;
}

interface MappedData {
    mappings: Record<string, string>;
    field_metadata: Record<string, MappingMetadata>;
}

interface ReviewPanelProps {
    documentId: string;
    filename: string;
    transcriptionText: string;
    onComplete: (finalData: Record<string, string>, filledFilename: string) => void;
    onCancel: () => void;
}

const REVIEW_STATUSES = [
    "Initializing Neural Engine",
    "Contextualizing Transcription",
    "Identifying Logical Entities",
    "Mapping Semantic Relationships",
    "Resolving Ambiguities",
    "Finalizing Verification Protocol"
];

export function ReviewPanel({ documentId, filename, transcriptionText, onComplete, onCancel }: ReviewPanelProps) {
    const [loading, setLoading] = useState(true);
    const [mappedData, setMappedData] = useState<MappedData | null>(null);
    const [editedMappings, setEditedMappings] = useState<Record<string, string>>({});
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setStatusIndex((prev) => (prev + 1) % REVIEW_STATUSES.length);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [loading]);

    useEffect(() => {
        async function fetchMapping() {
            try {
                setLoading(true);
                const result = await api.generateFormData(transcriptionText, documentId);
                setMappedData(result.mapped_data);
                setEditedMappings(result.mapped_data.mappings);
            } catch (error) {
                console.error("Failed to generate mapping:", error);
                alert("Failed to generate mapping. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        if (documentId && transcriptionText) {
            fetchMapping();
        }
    }, [documentId, transcriptionText]);

    const handleInputChange = (fieldName: string, value: string) => {
        setEditedMappings(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSave = async () => {
        setIsGeneratingPdf(true);
        setProgress(0);

        // Pseudo-realtime progress simulation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return 95;
                }
                return prev + 5;
            });
        }, 300);

        try {
            const result = await api.fillDocument(filename, editedMappings);
            setProgress(100);
            setTimeout(() => {
                onComplete(editedMappings, result.filled_filename);
            }, 500);
        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to generate document. Please try again.");
            setIsGeneratingPdf(false);
        } finally {
            clearInterval(progressInterval);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-10 glass-panel border-white/5 bg-slate-900/60 backdrop-blur-3xl animate-in fade-in duration-700">
                <div className="relative h-32 w-32">
                    {/* Nested Orbital Loader */}
                    <div className="absolute inset-0 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-4 border-4 border-violet-500/10 border-t-violet-500 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                    <div className="absolute inset-8 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-[spin_1.5s_linear_infinite]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 bg-blue-500 rounded-full animate-ping" />
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <div>
                        <p className="text-blue-400 font-black tracking-[0.3em] uppercase text-sm mb-1">Neural Analysis In Progress</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="h-1 w-1 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Protocol 7-Delta</span>
                        </div>
                    </div>

                    {/* Status Log */}
                    <div className="h-8 overflow-hidden relative">
                        <div
                            className="transition-all duration-500 transform"
                            style={{ transform: `translateY(-${statusIndex * 2}rem)` }}
                        >
                            {REVIEW_STATUSES.map((status, i) => (
                                <div key={i} className="h-8 flex items-center justify-center">
                                    <p className="text-slate-300 font-mono text-xs opacity-70">
                                        &gt; {status}...
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-48 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <style jsx>{`
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(300%); }
                    }
                `}</style>
            </div>
        );
    }

    if (!mappedData) return null;

    return (
        <div className="w-full flex flex-col glass-card border-white/5 bg-slate-900/20 backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 shadow-2xl">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-500/5 to-transparent">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Data Intelligence</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Verification Protocol</p>
                </div>
                <button
                    onClick={onCancel}
                    className="group glass-panel h-12 w-12 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto max-h-[60vh] p-8 space-y-8 custom-scrollbar">
                {Object.keys(editedMappings).length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {Object.keys(editedMappings).map((fieldName) => {
                            const metadata = mappedData.field_metadata[fieldName];
                            const confidence = metadata?.confidence || 0;
                            const isLowConfidence = confidence < 0.7;
                            const isAmbiguous = metadata?.is_ambiguous;

                            return (
                                <div key={fieldName} className={`group p-6 rounded-2xl glass-panel border-white/5 transition-all duration-300 ${isLowConfidence || isAmbiguous ? 'bg-red-500/5 border-red-500/20' : 'bg-white/0 hover:bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isLowConfidence ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                <span className="text-[10px] font-black">{fieldName.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{fieldName}</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {isAmbiguous && (
                                                <span className="bg-red-500/20 text-red-400 text-[10px] px-3 py-1 rounded-sm font-black uppercase tracking-tighter border border-red-500/30">Ambiguous</span>
                                            )}
                                            <span className={`text-[10px] px-3 py-1 rounded-sm font-black uppercase tracking-tighter border ${confidence > 0.8 ? 'bg-green-500/20 text-green-400 border-green-500/30' : confidence > 0.5 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                                {Math.round(confidence * 100)}% RELIABILITY
                                            </span>
                                        </div>
                                    </div>
                                    <textarea
                                        value={editedMappings[fieldName] || ""}
                                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                                        className="w-full bg-slate-900/40 border border-white/5 rounded-xl p-4 focus:border-blue-500/50 outline-none text-slate-100 transition-all font-medium min-h-[100px] resize-y placeholder-slate-700 shadow-inner"
                                        placeholder="Empty value detected..."
                                    />
                                    {metadata?.reasoning && (
                                        <div className="mt-4 flex gap-2">
                                            <div className="h-4 w-[2px] bg-blue-500/40 mt-0.5" />
                                            <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">
                                                <span className="text-blue-400/60 font-black not-italic inline-block mr-1">AI_LOG:</span> {metadata.reasoning}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8 glass-panel border-white/5 bg-slate-900/40 rounded-3xl animate-in fade-in zoom-in-95 duration-700">
                        <div className="h-24 w-24 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 relative z-10"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">No mapping candidates</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                                The AI analysis completed, but no form fields or template tags were identified in the source document.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[11px] text-blue-400 font-bold uppercase tracking-widest">
                                Tip: Ensure your document contains {"{{tags}}"} or form fields
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 flex gap-4 bg-slate-900/40">
                <button
                    onClick={onCancel}
                    className="flex-1 py-4 px-6 rounded-2xl glass-panel text-slate-400 font-black tracking-widest uppercase text-xs hover:text-white hover:bg-white/5 transition-all active:scale-95"
                >
                    Discard
                </button>
                <button
                    onClick={handleSave}
                    disabled={isGeneratingPdf}
                    className="flex-[2] relative overflow-hidden group py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black tracking-widest uppercase text-xs shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                    {isGeneratingPdf ? (
                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex flex-col items-center justify-center px-8">
                            <div className="w-full flex justify-between items-end mb-2">
                                <span className="text-[10px] text-blue-300 font-black animate-pulse">SYNTHESIZING...</span>
                                <span className="text-[10px] text-white font-black">{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line></svg>
                            <span>DEPLOY FINAL ASSET</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
