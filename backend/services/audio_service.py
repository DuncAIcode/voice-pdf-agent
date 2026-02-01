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
            
            # Wait for the file to be processed
            import time
            while audio_file.state.name == "PROCESSING":
                logging.info("Waiting for audio file processing...")
                time.sleep(1)
                audio_file = genai.get_file(audio_file.name)
                
            if audio_file.state.name == "FAILED":
                raise ValueError(f"Audio processing failed: {audio_file.state.name}")
            
            # Prompt for transcription
            prompt = "Transcribe the following audio file. Return the transcription exactly as spoken."
            
            logging.info("Generating transcription...")
            # Use the model initialized in __init__ (gemini-flash-latest) which is compatible with User's plan
            response = self.model.generate_content([prompt, audio_file])
            
            # Safe text extraction
            try:
                text = response.text
            except Exception as e:
                logging.warning(f"Failed to get response.text: {e}")
                # Try to inspect candidates for debug info
                if response.candidates:
                    finish_reason = response.candidates[0].finish_reason
                    text = f"[No text generated. Finish Reason: {finish_reason}]"
                    if response.prompt_feedback:
                         text += f" [Feedback: {response.prompt_feedback}]"
                else:
                    text = "[No candidates returned]"
            
            # Return in the format expected by the frontend (list of segments)
            return [{"text": text, "start": 0, "end": 0, "speaker": "Speaker"}]
            
        except Exception as e:
            logging.error(f"Error transcribing audio with Gemini: {e}")
            return [{"text": f"[Error: {str(e)}]", "start": 0, "end": 0, "speaker": "System"}]
