"use client";

interface NavBarProps {
    activeTab: "record" | "documents" | "completed";
    setActiveTab: (tab: "record" | "documents" | "completed") => void;
}

export function NavBar({ activeTab, setActiveTab }: NavBarProps) {
    return (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
            <div className="glass-panel p-2 rounded-full flex items-center justify-between shadow-2xl border-white/5 bg-slate-900/40 backdrop-blur-2xl">
                <button
                    onClick={() => setActiveTab("record")}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-full transition-all duration-300 ${activeTab === "record"
                        ? "bg-blue-600/20 text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                    <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Record</span>
                </button>

                <button
                    onClick={() => setActiveTab("documents")}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-full transition-all duration-300 ${activeTab === "documents"
                        ? "bg-blue-600/20 text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" x2="8" y1="13" y2="13" />
                        <line x1="16" x2="8" y1="17" y2="17" />
                    </svg>
                    <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Vault</span>
                </button>

                <button
                    onClick={() => setActiveTab("completed")}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-full transition-all duration-300 ${activeTab === "completed"
                        ? "bg-blue-600/20 text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Logs</span>
                </button>
            </div>
        </nav>
    );
}
