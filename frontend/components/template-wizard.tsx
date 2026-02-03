"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
    original_text: string;
    suggested_tag: string;
    reason: string;
    selected: boolean;
    is_manual?: boolean;
}

interface TemplateWizardProps {
    filename: string;
    onComplete: (documentId: string, newFilename: string) => void;
    onCancel: () => void;
}

const ANALYZING_STATUSES = [
    "Analyzing Document Structure",
    "Extracting Semantic Metadata",
    "Heuristically Identifying Fields",
    "Gemini_v1.5 Neural Classification",
    "Validating Placeholder Logic",
    "Finalizing Suggestions"
];

export function TemplateWizard({ filename, onComplete, onCancel }: TemplateWizardProps) {
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isTransforming, setIsTransforming] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    // Preview State
    const [previewHtml, setPreviewHtml] = useState<string>("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setStatusIndex((prev) => (prev + 1) % ANALYZING_STATUSES.length);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [loading]);

    useEffect(() => {
        async function fetchAnalysis() {
            try {
                setLoading(true);
                const result = await api.analyzeDocument(filename);
                setSuggestions(
                    result.suggestions.map((s: any) => ({
                        ...s,
                        selected: true,
                    }))
                );
            } catch (error) {
                console.error("Failed to analyze document:", error);
                alert("Failed to analyze document. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        async function fetchPreview() {
            try {
                const result = await api.extractPreview(filename);
                setPreviewHtml(result.html);
            } catch (error) {
                console.error("Failed to fetch document preview:", error);
            }
        }

        if (filename) {
            fetchAnalysis();
            fetchPreview();
        }
    }, [filename]);

    const handleToggle = (index: number) => {
        setSuggestions(prev => prev.map((s, i) => i === index ? { ...s, selected: !s.selected } : s));
    };

    const handleTagChange = (index: number, newTag: string) => {
        setSuggestions(prev => prev.map((s, i) => i === index ? { ...s, suggested_tag: newTag } : s));
    };

    const handleOriginalTextChange = (index: number, newText: string) => {
        setSuggestions(prev => prev.map((s, i) => i === index ? { ...s, original_text: newText } : s));
    };

    const handleAddField = () => {
        const newIndex = suggestions.length;
        setSuggestions(prev => [
            ...prev,
            {
                original_text: "",
                suggested_tag: "new_field",
                reason: "Manually added field",
                selected: true,
                is_manual: true
            }
        ]);
        setFocusedIndex(newIndex);
    };

    const setFromSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString() && focusedIndex !== null) {
            handleOriginalTextChange(focusedIndex, selection.toString().trim());
        }
    };

    const handleSave = async () => {
        const selectedReplacements = suggestions
            .filter(s => s.selected)
            .map(s => ({
                original_text: s.original_text.trim(),
                tag_name: s.suggested_tag.trim()
            }));

        const invalidFields = selectedReplacements.filter(r => !r.original_text || !r.tag_name);
        if (invalidFields.length > 0) {
            alert("All selected fields must have both anchor text and a tag name.");
            return;
        }

        if (selectedReplacements.length === 0) {
            alert("Please select or add at least one field to transform.");
            return;
        }

        setIsTransforming(true);
        setProgress(0);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return 95;
                }
                return prev + 5;
            });
        }, 200);

        try {
            const result = await api.transformTemplate(filename, selectedReplacements);
            setProgress(100);
            setTimeout(() => {
                onComplete(result.document_id, result.filename);
            }, 500);
        } catch (error) {
            console.error("Transformation failed:", error);
            alert("Failed to transform template. Please try again.");
            setIsTransforming(false);
        } finally {
            clearInterval(progressInterval);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-10 glass-panel border-white/5 bg-slate-900/60 backdrop-blur-3xl animate-in fade-in duration-700">
                <div className="relative h-32 w-32">
                    {/* Nested Orbital Loader */}
                    <div className="absolute inset-0 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-4 border-4 border-violet-500/10 border-t-violet-500 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                    <div className="absolute inset-8 border-4 border-fuchsia-500/10 border-t-fuchsia-500 rounded-full animate-[spin_1.5s_linear_infinite]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 bg-indigo-500 rounded-full animate-ping" />
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <div>
                        <p className="text-indigo-400 font-black tracking-[0.3em] uppercase text-sm mb-1">AI Structure Analysis In Progress</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="h-1 w-1 bg-indigo-500 rounded-full animate-pulse" />
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Logic Engine v2</span>
                        </div>
                    </div>

                    {/* Status Log */}
                    <div className="h-8 overflow-hidden relative">
                        <div
                            className="transition-all duration-500 transform"
                            style={{ transform: `translateY(-${statusIndex * 2}rem)` }}
                        >
                            {ANALYZING_STATUSES.map((status, i) => (
                                <div key={i} className="h-8 flex items-center justify-center">
                                    <p className="text-slate-300 font-mono text-xs opacity-70">
                                        &gt; {status}...
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-48 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
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

    return (
        <div className="w-full flex flex-col glass-card border-white/5 bg-slate-900/20 backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 shadow-2xl">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-indigo-500/5 to-transparent">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Template Wizard</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Smart Field Detection</p>
                </div>
                <button
                    onClick={onCancel}
                    className="group glass-panel h-12 w-12 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Document Preview Side Panel */}
                <AnimatePresence>
                    {isPreviewOpen && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }}
                            exit={{ x: "-100%", opacity: 0 }}
                            className="absolute left-0 top-0 bottom-0 w-[450px] z-50 glass-panel border-r border-white/10 bg-slate-950/90 backdrop-blur-3xl shadow-[50px_0_100px_rgba(0,0,0,0.5)] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-indigo-500/10">
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-tighter">Document Preview</h3>
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Select text to use as anchor</p>
                                </div>
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                                <div
                                    ref={previewRef}
                                    className="prose prose-invert prose-sm max-w-none doc-preview-content"
                                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                                    onMouseUp={setFromSelection}
                                />

                                {focusedIndex !== null && (
                                    <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent">
                                        <div className="bg-indigo-600 rounded-xl p-3 shadow-2xl animate-bounce-subtle border border-indigo-400/50 flex items-center justify-between">
                                            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Select text to auto-fill anchor</p>
                                            <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="indigo" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* View Document Toggle Button */}
                    {!isPreviewOpen && (
                        <motion.button
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsPreviewOpen(true)}
                            className="absolute left-6 top-6 z-40 px-5 py-3 bg-indigo-600/90 backdrop-blur-md text-white rounded-full shadow-2xl shadow-indigo-500/40 border border-indigo-400/30 flex items-center gap-2 group animate-bounce-subtle"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                            <span className="text-[11px] font-black uppercase tracking-widest">View Document</span>
                        </motion.button>
                    )}

                    {/* Scroll Area */}
                    <div className="flex-1 overflow-y-auto max-h-[60vh] p-8 space-y-6 custom-scrollbar">
                        {suggestions.length > 0 ? (
                            <>
                                <div className="flex justify-between items-center bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl">
                                    <div className="text-[11px] text-indigo-300 font-medium leading-relaxed">
                                        <span className="font-black mr-2">WIZARD LOG:</span>
                                        Found {suggestions.length} potential smart fields. Select or add fields to convert.
                                    </div>
                                    <button
                                        onClick={handleAddField}
                                        className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/20 rounded-lg text-[10px] font-black text-indigo-300 uppercase tracking-widest transition-all"
                                    >
                                        + Add Field
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {suggestions.map((s, index) => (
                                        <div
                                            key={index}
                                            className={`group p-5 rounded-2xl border transition-all duration-300 ${s.selected
                                                ? 'bg-indigo-500/5 border-indigo-500/20'
                                                : 'bg-slate-900/40 border-white/5 opacity-60'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <button
                                                    onClick={() => handleToggle(index)}
                                                    className={`mt-1 h-6 w-6 rounded-lg flex items-center justify-center transition-all ${s.selected ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-600 border border-white/5'
                                                        }`}
                                                >
                                                    {s.selected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                </button>

                                                <div className="flex-1 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1 flex-1">
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Original Text (Anchor)</p>
                                                            <input
                                                                type="text"
                                                                value={s.original_text}
                                                                onFocus={() => setFocusedIndex(index)}
                                                                onChange={(e) => handleOriginalTextChange(index, e.target.value)}
                                                                placeholder="Text to replace..."
                                                                className={`w-full bg-slate-950/30 border rounded px-2 py-1 text-sm font-bold text-slate-200 outline-none transition-all ${focusedIndex === index ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)] bg-indigo-500/5' : 'border-white/5 focus:border-indigo-500/30'}`}
                                                            />
                                                        </div>
                                                        <div className="ml-4 px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                            {s.is_manual ? 'Manual Entry' : 'Detected'}
                                                        </div>
                                                    </div>

                                                    {s.selected && (
                                                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300 border-t border-white/5 pt-3">
                                                            <p className="text-[10px] font-black text-indigo-400/80 uppercase tracking-widest">Converted Tag Name</p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-indigo-400 font-bold">{"{{"}</span>
                                                                <input
                                                                    type="text"
                                                                    value={s.suggested_tag}
                                                                    onChange={(e) => handleTagChange(index, e.target.value)}
                                                                    className="flex-1 bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-sm font-mono text-indigo-300 focus:border-indigo-500/50 outline-none transition-all"
                                                                />
                                                                <span className="text-indigo-400 font-bold">{"}}"}</span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-600 italic font-medium">{s.reason}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6 glass-panel border-white/5 bg-slate-900/40">
                                <div className="h-16 w-16 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-white font-black uppercase tracking-tight">No fields detected</h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                                        AI couldn't find any clear placeholders. You can manually define fields by adding anchors below.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={onCancel}
                                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all"
                                    >
                                        Exit
                                    </button>
                                    <button
                                        onClick={handleAddField}
                                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
                                    >
                                        Setup Manually
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 flex gap-4 bg-slate-900/40">
                <button
                    onClick={onCancel}
                    className="flex-1 py-4 px-6 rounded-2xl glass-panel text-slate-400 font-black tracking-widest uppercase text-xs hover:text-white hover:bg-white/5 transition-all active:scale-95"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isTransforming}
                    className="flex-[2] relative overflow-hidden group py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-black tracking-widest uppercase text-xs shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                    {isTransforming ? (
                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex flex-col items-center justify-center px-8">
                            <div className="w-full flex justify-between items-end mb-2">
                                <span className="text-[10px] text-indigo-300 font-black animate-pulse">TRANSFORMING...</span>
                                <span className="text-[10px] text-white font-black">{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>
                            <span>Generate Smart Template</span>
                        </>
                    )}
                </button>
            </div>
            <style jsx>{`
                    .doc-preview-content {
                        font-family: 'Inter', system-ui, sans-serif;
                    }
                    .doc-preview-content :global(h1) { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: white; }
                    .doc-preview-content :global(h2) { font-size: 1.25rem; font-weight: 700; margin-top: 1.5rem; color: #e2e8f0; }
                    .doc-preview-content :global(p) { margin-bottom: 0.75rem; color: #94a3b8; line-height: 1.6; }
                    .doc-preview-content :global(ul) { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                    .doc-preview-content :global(ol) { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
                    .doc-preview-content :global(strong) { color: white; font-weight: 700; }
                    
                    @keyframes bounce-subtle {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-4px); }
                    }
                    .animate-bounce-subtle {
                        animation: bounce-subtle 2s ease-in-out infinite;
                    }
                `}</style>
        </div>
    );
}
