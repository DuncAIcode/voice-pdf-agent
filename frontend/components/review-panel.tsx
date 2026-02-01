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

export function ReviewPanel({ documentId, filename, transcriptionText, onComplete, onCancel }: ReviewPanelProps) {
    const [loading, setLoading] = useState(true);
    const [mappedData, setMappedData] = useState<MappedData | null>(null);
    const [editedMappings, setEditedMappings] = useState<Record<string, string>>({});
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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
        try {
            const result = await api.fillPDF(filename, editedMappings);
            console.log("PDF Fill result:", result);
            onComplete(editedMappings, result.filled_filename);
        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-white rounded-2xl shadow-xl border border-slate-100 animate-pulse">
                <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">AI is mapping your transcription...</p>
            </div>
        );
    }

    if (!mappedData) return null;

    return (
        <div className="w-full flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Review & Edit</h2>
                    <p className="text-sm text-slate-500">Verify the AI-mapped information</p>
                </div>
                <button
                    onClick={onCancel}
                    className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[60vh] p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {Object.keys(editedMappings).map((fieldName) => {
                        const metadata = mappedData.field_metadata[fieldName];
                        const confidence = metadata?.confidence || 0;
                        const isLowConfidence = confidence < 0.7;
                        const isAmbiguous = metadata?.is_ambiguous;

                        return (
                            <div key={fieldName} className={`p-4 rounded-xl border transition-all ${isLowConfidence || isAmbiguous ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <label className="text-sm font-semibold text-slate-700">{fieldName}</label>
                                    <div className="flex items-center space-x-2">
                                        {isAmbiguous && (
                                            <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Ambiguous</span>
                                        )}
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${confidence > 0.8 ? 'bg-green-100 text-green-600' : confidence > 0.5 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                                            {Math.round(confidence * 100)}% Match
                                        </span>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={editedMappings[fieldName] || ""}
                                    onChange={(e) => handleInputChange(fieldName, e.target.value)}
                                    className="w-full bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none py-1 text-slate-800 transition-colors"
                                />
                                {metadata?.reasoning && (
                                    <p className="mt-2 text-xs text-slate-500 italic">
                                        <span className="font-semibold not-italic">AI Reasoning:</span> {metadata.reasoning}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex space-x-3">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-all shadow-sm"
                >
                    Discard
                </button>
                <button
                    onClick={handleSave}
                    disabled={isGeneratingPdf}
                    className="flex-[2] py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2"
                >
                    {isGeneratingPdf ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            <span>Generate & Finalize PDF</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
