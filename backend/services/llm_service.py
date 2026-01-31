import google.generativeai as genai
import os
import json
from typing import List, Dict, Any

class LLMService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-flash-latest')

    async def map_transcription_to_fields(self, transcription_text: str, pdf_fields: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Maps transcription text to PDF fields using Gemini with enriched metadata.
        """
        if not pdf_fields:
            return {"mappings": {}, "field_metadata": {}}

        # Prepare field descriptions for the prompt
        field_descriptions = []
        for f in pdf_fields:
            name = f.get('field_name', f.get('name', 'N/A'))
            label = f.get('field_label', 'N/A')
            f_type = f.get('field_type', 'N/A')
            desc = f"- Name: {name}, Label: {label}, Type: {f_type}"
            field_descriptions.append(desc)
        
        fields_str = "\n".join(field_descriptions)
        
        prompt = f"""
        You are an expert AI assistant specializing in form-filling from conversation transcripts.
        
        ### TASK
        Map the provided conversation transcription to the specific PDF form fields listed below.
        
        ### FORM FIELDS
        {fields_str}
        
        ### TRANSCRIPTION
        "{transcription_text}"
        
        ### INSTRUCTIONS
        1. **Extraction**: Identify data in the transcription that belongs in each field.
        2. **Normalization**: 
           - Dates: YYYY-MM-DD
           - Boolean/Checkboxes: "Yes" or "No"
           - Options: Match the closest valid option if a list is implied.
        3. **Confidence Scoring**: For each mapping, assign a confidence score between 0.0 and 1.0.
        4. **Reasoning**: Briefly explain why you made the mapping (cite snippets from the transcript).
        5. **Ambiguity**: If the transcript contains contradictory info or if information is partially missing, flag it as ambiguous.
        6. **Missing Data**: If no information is found for a field, set the value to null.

        ### OUTPUT FORMAT
        Return ONLY a JSON object with the following structure:
        {{
            "mappings": {{
                "field_name": "extracted_value"
            }},
            "field_metadata": {{
                "field_name": {{
                    "confidence": 0.0-1.0,
                    "reasoning": "...",
                    "is_ambiguous": true/false
                }}
            }}
        }}
        """

        try:
            # We use the blocking call here for simplicity, but wrap it as async if needed.
            # Most GenAI calls are blocking unless using the experimental async client.
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            
            # Clean up potential markdown code blocks in response
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
            return json.loads(text)
        except Exception as e:
            print(f"Error calling LLM: {e}")
            return {"mappings": {}, "error": str(e)}
