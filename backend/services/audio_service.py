import gc
import google.generativeai as genai
import os
import logging
import json

class AudioService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logging.warning("GEMINI_API_KEY not found in environment variables. Audio transcription will fail.")
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-flash-latest')

    def transcribe(self, audio_path: str):
        """
        Transcribes audio using Google Gemini Flash.
        Returns a list of segments (mocked timestamps for now) or full text wrapped in a segment.
        """
        try:
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f"Audio file not found: {audio_path}")
            
            # Upload the file to Gemini
            logging.info(f"Uploading file {audio_path} to Gemini...")
            audio_file = genai.upload_file(path=audio_path)
            
            # Prompt for transcription
            prompt = "Transcribe the following audio file. Return the transcription exactly as spoken."
            
            logging.info("Generating transcription...")
            response = self.model.generate_content([prompt, audio_file])
            
            text = response.text
            
            # Return in the format expected by the frontend (list of segments)
            # Since Gemini doesn't natively return segments with timestamps in a simple text prompt,
            # we will return the whole text as one segment for now.
            return [{"text": text, "start": 0, "end": 0, "speaker": "Speaker"}]
            
        except Exception as e:
            logging.error(f"Error transcribing audio with Gemini: {e}")
            return [{"text": f"[Error: {str(e)}]", "start": 0, "end": 0, "speaker": "System"}]
