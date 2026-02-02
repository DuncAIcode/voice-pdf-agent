"use client";

import React, { useEffect, useState } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";

interface TourProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    onComplete?: () => void;
}

export function Tour({ activeTab, setActiveTab, onComplete }: TourProps) {
    const [run, setRun] = useState(false);

    useEffect(() => {
        // Check if tour has been completed before
        const hasCompletedTour = localStorage.getItem("tour-completed");
        if (!hasCompletedTour) {
            // Delay slightly for initial animations
            const timer = setTimeout(() => setRun(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const steps: Step[] = [
        {
            target: "#tour-step-1",
            content: "Welcome to Voice to PDF AI! Start by learning how to upload your document templates in the Vault.",
            placement: "bottom",
            disableBeacon: true,
        },
        {
            target: "#nav-vault",
            content: "Click here to open your Document Vault and manage your templates.",
            placement: "top",
        },
        {
            target: "#vault-upload",
            content: "Upload a Word or PDF file with placeholders (like [Name] or {{Date}}). Our AI will find them automatically!",
            placement: "bottom",
        },
        {
            target: "#nav-record",
            content: "Once your template is ready, head over to the Record tab to start your session.",
            placement: "top",
        },
        {
            target: "#tour-record-area",
            content: "Press the pulse and speak naturally. Tell the AI the details for your document in any order.",
            placement: "bottom",
        },
        {
            target: "#tour-proceed-mapping",
            content: "After transcription, click this button to see how the AI mapped your voice to the template fields.",
            placement: "top",
        },
        {
            target: "#nav-logs",
            content: "Finally, check your Logs to see all completed documents and download them anytime.",
            placement: "top",
        },
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { action, index, status, type } = data;

        if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
            setRun(false);
            localStorage.setItem("tour-completed", "true");
            onComplete?.();
        }

        // Tab switching logic based on step index
        if (type === "step:after" || type === "target:not_found") {
            const nextIndex = index + (action === "prev" ? -1 : 1);

            // Step 2 -> 3 (Switch to Vault)
            if (nextIndex === 2) {
                setActiveTab("documents");
            }
            // Step 3 -> 4 (Switch back to Record/Home) or Step 4 -> 5
            if (nextIndex === 4) {
                setActiveTab("record");
            }
            // Final step switching
            if (nextIndex === 6) {
                setActiveTab("completed");
            }
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    arrowColor: "#1e293b",
                    backgroundColor: "#1e293b",
                    overlayColor: "rgba(0, 0, 0, 0.75)",
                    primaryColor: "#3b82f6",
                    textColor: "#f8fafc",
                    zIndex: 10000,
                },
                tooltipContainer: {
                    textAlign: "left",
                    borderRadius: "1rem",
                    padding: "0.5rem",
                },
                buttonNext: {
                    borderRadius: "0.5rem",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                },
                buttonBack: {
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: "bold",
                    color: "#94a3b8",
                },
                buttonSkip: {
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: "bold",
                    color: "#64748b",
                }
            }}
        />
    );
}
