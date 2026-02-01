"use client";

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
    stream: MediaStream | null;
    isRecording: boolean;
}

export function AudioVisualizer({ stream, isRecording }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const contextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!stream || !isRecording) {
            if (contextRef.current && contextRef.current.state !== 'closed') {
                contextRef.current.close();
            }
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            return;
        }

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        contextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasCtx = canvas.getContext("2d");
        if (!canvasCtx) return;

        const draw = () => {
            if (!isRecording) return;

            requestRef.current = requestAnimationFrame(draw);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);

            const width = canvas.width;
            const height = canvas.height;

            canvasCtx.clearRect(0, 0, width, height);

            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                const gradient = canvasCtx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, "#3b82f6"); // blue-500
                gradient.addColorStop(1, "#60a5fa"); // blue-400

                canvasCtx.fillStyle = gradient;
                canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (contextRef.current && contextRef.current.state !== 'closed') {
                contextRef.current.close();
            }
        };
    }, [stream, isRecording]);

    return (
        <canvas
            ref={canvasRef}
            width={300}
            height={100}
            className="w-full max-w-xs h-24 rounded-lg bg-slate-50 border border-slate-100"
        />
    );
}
