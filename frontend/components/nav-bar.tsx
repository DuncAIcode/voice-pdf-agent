"use client";

interface NavBarProps {
    activeTab: "record" | "documents" | "completed";
    setActiveTab: (tab: "record" | "documents" | "completed") => void;
}

export function NavBar({ activeTab, setActiveTab }: NavBarProps) {
    return (
        <div className="flex h-16 w-full items-center justify-around border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <button
                onClick={() => setActiveTab("record")}
                className={`flex flex-col items-center justify-center space-y-1 ${activeTab === "record" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                <span className="text-xs font-medium">Record</span>
            </button>

            <button
                onClick={() => setActiveTab("documents")}
                className={`flex flex-col items-center justify-center space-y-1 ${activeTab === "documents" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                <span className="text-xs font-medium">Documents</span>
            </button>

            <button
                onClick={() => setActiveTab("completed")}
                className={`flex flex-col items-center justify-center space-y-1 ${activeTab === "completed" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span className="text-xs font-medium">Completed</span>
            </button>
        </div>
    );
}
