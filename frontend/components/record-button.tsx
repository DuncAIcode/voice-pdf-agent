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
        <div className="flex flex-col items-center space-y-6 w-full max-w-sm">
            {/* Visualizer Area */}
            <div className={`w-full transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-0 h-0 hidden'}`}>
                <AudioVisualizer stream={stream} isRecording={isRecording && !isPaused} />
                <p className="text-center text-sm text-slate-500 mt-2">
                    {isPaused ? "Recording Paused" : "Listening..."}
                </p>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-6">

                {/* Pause/Resume Button (Only visible when recording) */}
                {(isRecording || isPaused) && (
                    <button
                        onClick={togglePause}
                        className="h-12 w-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-sm"
                        title={isPaused ? "Resume" : "Pause"}
                    >
                        {isPaused ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        )}
                    </button>
                )}

                {/* Main Record/Stop Button */}
                <button
                    onClick={handleMainButtonClick}
                    disabled={isProcessing}
                    className={`h-20 w-20 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${isRecording || isPaused
                        ? "bg-red-500 hover:bg-red-600 scale-110"
                        : isProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    <span className="sr-only">
                        {(isRecording || isPaused) ? "Stop Recording" : isProcessing ? "Processing..." : "Record"}
                    </span>
                    {isProcessing ? (
                        <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (isRecording || isPaused) ? (
                        <div className="h-8 w-8 bg-white rounded-md" />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                        >
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" x2="12" y1="19" y2="22" />
                        </svg>
                    )}
                </button>

                {/* Spacer to keep main button centered relative to Pause button if we added a third button later */}
                {(isRecording || isPaused) && (
                    <div className="w-12" />
                )}

            </div>
        </div>
    );
}
