"use client";

import { useState, useEffect, useRef } from "react";
import { audioStorage, AudioBackup } from "../lib/audio-storage";
import { api } from "../lib/api";

interface LocalBackupsProps {
    onRetrySuccess?: (data: any) => void;
}

export function LocalBackups({ onRetrySuccess }: LocalBackupsProps) {
    const [backups, setBackups] = useState<AudioBackup[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isRetrying, setIsRetrying] = useState<string | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const initVault = async () => {
            await audioStorage.cleanupOldRecordings(48); // Cleanup items older than 48h
            await loadBackups();
        };
        initVault();

        // Subscribe to real-time updates from other components/tabs
        const unsubscribe = audioStorage.onUpdate(() => {
            console.log("Vault update detected, refreshing list...");
            loadBackups();
        });

        return () => unsubscribe();
    }, []);

    const loadBackups = async () => {
        const items = await audioStorage.getAllBackups();
        setBackups(items);
    };

    const handleDownload = (backup: AudioBackup) => {
        const url = URL.createObjectURL(backup.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = backup.filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Permanently delete this local recording?")) {
            if (playingId === id) {
                audioRef.current?.pause();
                setPlayingId(null);
            }
            await audioStorage.deleteRecording(id);
            await loadBackups();
        }
    };

    const handleRetry = async (backup: AudioBackup) => {
        setIsRetrying(backup.id);
        try {
            const result = await api.transcribeAudio(backup.blob);
            if (onRetrySuccess) {
                onRetrySuccess(result);
            }
            alert("Transcription recovery successful!");
            setIsOpen(false);
        } catch (error) {
            console.error("Retry failed:", error);
            alert("Transcription retry failed. Please try again later.");
        } finally {
            setIsRetrying(null);
        }
    };

    const togglePlay = (backup: AudioBackup) => {
        if (playingId === backup.id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                const url = URL.createObjectURL(backup.blob);
                audioRef.current.src = url;
                audioRef.current.play();
                setPlayingId(backup.id);

                // Cleanup URL when done or changed
                audioRef.current.onended = () => {
                    setPlayingId(null);
                    URL.revokeObjectURL(url);
                };
            }
        }
    };

    if (backups.length === 0) return null;

    return (
        <div className="w-full max-w-lg mt-8 mb-4">
            <audio ref={audioRef} className="hidden" />

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-xs font-black uppercase tracking-[0.2em] text-blue-400/80 hover:text-blue-400 transition-colors py-2 px-4 glass-card border-blue-500/10 group"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span>Saved Recordings: {backups.length} Local {backups.length === 1 ? 'Backup' : 'Backups'}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {isOpen && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {backups.map((backup) => (
                        <div key={backup.id} className="glass-card p-4 border-white/5 bg-white/[0.02] flex items-center justify-between group">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-200 truncate max-w-[180px]">
                                    {backup.filename}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                    {new Date(backup.timestamp).toLocaleString()} • {(backup.blob.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                {/* Play Button */}
                                <button
                                    onClick={() => togglePlay(backup)}
                                    className={`p-2 rounded-lg transition-all ${playingId === backup.id ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'}`}
                                    title={playingId === backup.id ? "Pause" : "Play Local Recording"}
                                >
                                    {playingId === backup.id ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleRetry(backup)}
                                    disabled={isRetrying !== null}
                                    className={`p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all ${isRetrying === backup.id ? 'animate-pulse' : ''}`}
                                    title="Retry Transcription"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
                                </button>

                                <button
                                    onClick={() => handleDownload(backup)}
                                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
                                    title="Download Raw Audio"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                </button>

                                <button
                                    onClick={() => handleDelete(backup.id)}
                                    className="p-2 rounded-lg bg-red-500/5 text-slate-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Recording"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={async () => {
                            if (confirm("Clear all local recordings?")) {
                                for (const b of backups) {
                                    await audioStorage.deleteRecording(b.id);
                                }
                                await loadBackups();
                            }
                        }}
                        className="w-full py-2 text-[10px] font-bold text-slate-600 hover:text-red-400 transition-colors uppercase tracking-widest"
                    >
                        Clear All Recorded Data
                    </button>
                </div>
            )}
        </div>
    );
}
