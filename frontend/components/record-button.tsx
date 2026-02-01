"use client";

import { useState, useRef } from "react";
import { api } from "../lib/api";
import { AudioVisualizer } from "./audio-visualizer";

interface RecordButtonProps {
    onTranscriptionComplete?: (data: any) => void;
}

export function RecordButton({ onTranscriptionComplete }: RecordButtonProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    // Keep track of the stream reference to stop tracks later
    const streamRef = useRef<MediaStream | null>(null);

    const startRecording = async () => {
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(audioStream);
            streamRef.current = audioStream;

            const mediaRecorder = new MediaRecorder(audioStream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });

                // Cleanup stream
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }
                setStream(null);

                setIsProcessing(true);
                try {
                    const result = await api.transcribeAudio(audioBlob);
                    console.log("Transcription result:", result);
                    if (onTranscriptionComplete) {
                        onTranscriptionComplete(result);
                    } else {
                        alert(`Transcription complete: ${result.transcript_segments ? result.transcript_segments.length + " segments" : "Success"}`);
                    }
                } catch (error) {
                    console.error("Transcription failed", error);
                    alert("Transcription failed");
                } finally {
                    setIsProcessing(false);
                    // Reset all states
                    setIsRecording(false);
                    setIsPaused(false);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsPaused(false);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && (isRecording || isPaused)) {
            mediaRecorderRef.current.stop();
            // State cleanup happens in onstop
        }
    };

    const togglePause = () => {
        if (!mediaRecorderRef.current) return;

        if (isPaused) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
        } else {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
        }
    };

    const handleMainButtonClick = () => {
        if (isProcessing) return;

        if (isRecording || isPaused) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="flex flex-col items-center space-y-12 w-full max-w-sm">
            {/* Visualizer Area */}
            <div className={`w-full transition-all duration-500 overflow-hidden ${isRecording ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}`}>
                <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5 backdrop-blur-xl">
                    <AudioVisualizer stream={stream} isRecording={isRecording && !isPaused} />
                    <p className="text-center text-xs font-bold tracking-widest uppercase text-blue-400 mt-4 animate-pulse">
                        {isPaused ? "Recording Paused" : "AI Listening..."}
                    </p>
                </div>
            </div>

            {/* Main Interaction Area */}
            <div className="relative flex items-center justify-center">

                {/* Background Pulse Rings (Visible when recording) */}
                {(isRecording && !isPaused) && (
                    <>
                        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse-ring" style={{ animationDelay: '0s' }} />
                        <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-pulse-ring" style={{ animationDelay: '1s' }} />
                    </>
                )}

                {/* Main Button Group */}
                <div className="relative flex items-center space-x-8">

                    {/* Secondary Controls (Pause/Resume) */}
                    {(isRecording || isPaused) && (
                        <button
                            onClick={togglePause}
                            className="h-14 w-14 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90"
                            title={isPaused ? "Resume" : "Pause"}
                        >
                            {isPaused ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Main Circular Button */}
                    <button
                        onClick={handleMainButtonClick}
                        disabled={isProcessing}
                        className={`group relative h-28 w-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isRecording || isPaused
                            ? "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/40 hover:scale-105"
                            : isProcessing
                                ? "bg-slate-800 cursor-not-allowed scale-95 opacity-50"
                                : "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-blue-500/40 hover:scale-110 active:scale-95 translate-y-0 hover:-translate-y-1"
                            }`}
                    >
                        {/* Internal Glow */}
                        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                        {isProcessing ? (
                            <div className="flex flex-col items-center">
                                <div className="h-10 w-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            </div>
                        ) : (isRecording || isPaused) ? (
                            <div className="h-10 w-10 bg-white rounded-2xl shadow-inner animate-in zoom-in duration-300" />
                        ) : (
                            <div className="flex flex-col items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white drop-shadow-lg"
                                >
                                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" x2="12" y1="19" y2="22" />
                                </svg>
                            </div>
                        )}
                    </button>

                    {/* Spacer/Empty div to keep main button centered if Pause isn't there */}
                    {!(isRecording || isPaused) && (
                        <div className="w-0" />
                    )}
                </div>
            </div>

            {/* Status Text (Below button) */}
            <div className="text-center h-4">
                {!isRecording && !isProcessing && (
                    <p className="text-slate-500 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-700">
                        Tap to begin recording
                    </p>
                )}
                {isProcessing && (
                    <p className="text-blue-400 text-sm font-bold tracking-widest uppercase animate-pulse">
                        Analyzing Audio
                    </p>
                )}
            </div>
        </div>
    );
}
