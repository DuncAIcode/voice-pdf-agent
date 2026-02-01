"use client";

interface TranscriptSegment {
    text: string;
    start?: number;
    end?: number;
    speaker?: string;
}

interface TranscriptionResult {
    text?: string;
    full_text?: string;
    transcript_segments?: TranscriptSegment[];
    language?: string;
}

interface TranscriptionDisplayProps {
    data: TranscriptionResult | null;
}

export function TranscriptionDisplay({ data }: TranscriptionDisplayProps) {
    if (!data) return null;

    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const timeStr = now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });

    const segments = data.transcript_segments || (data.text ? [{ text: data.text }] : data.full_text ? [{ text: data.full_text }] : []);

    return (
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Transcription Result</h3>
                <div className="text-xs text-slate-400 text-right">
                    <div>{dateStr}</div>
                    <div>{timeStr}</div>
                </div>
            </div>

            <div className="p-0 max-h-96 overflow-y-auto">
                {segments.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 italic">
                        No text transcribed.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {segments.map((segment, index) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex gap-3">
                                    {segment.start !== undefined && (
                                        <span className="text-xs font-mono text-slate-400 shrink-0 mt-1">
                                            {formatTime(segment.start)}
                                        </span>
                                    )}
                                    <p className="text-slate-700 leading-relaxed text-sm">
                                        {segment.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {data.language && (
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
                    Detected Language: <span className="font-medium uppercase">{data.language}</span>
                </div>
            )}
        </div>
    );
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
