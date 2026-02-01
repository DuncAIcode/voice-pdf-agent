export const API_BASE_URL = process.env.NODE_ENV === "production"
    ? "/api"
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

export const api = {
    uploadPDF: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload PDF");
        }

        return response.json();
    },

    transcribeAudio: async (audioBlob: Blob, filename: string = "recording.wav") => {
        const formData = new FormData();
        formData.append("file", audioBlob, filename);

        const response = await fetch(`${API_BASE_URL}/transcribe`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to transcribe audio");
        }

        return response.json();
    },

    generateFormData: async (text: string, documentId: string) => {
        const response = await fetch(`${API_BASE_URL}/generate-form-data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, document_id: documentId }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate form data");
        }

        return response.json();
    },

    fillPDF: async (filename: string, data: Record<string, string>) => {
        const response = await fetch(`${API_BASE_URL}/fill-pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ filename, data }),
        });

        if (!response.ok) {
            throw new Error("Failed to fill PDF");
        }

        return response.json();
    },
};
