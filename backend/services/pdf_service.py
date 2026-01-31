import fitz  # PyMuPDF
from typing import Dict, List, Any
import os

class PDFService:
    def extract_fields(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Extracts form fields from a PDF with detailed metadata using PyMuPDF.
        Returns a list of dictionaries with name, label, type, page, and coordinates.
        """
        try:
            doc = fitz.open(file_path)
            extracted = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                widgets = page.widgets()
                if not widgets:
                    continue
                
                for widget in widgets:
                    extracted.append({
                        "name": widget.field_name,
                        "label": widget.field_label or widget.field_name,
                        "type": widget.field_type_string,
                        "page": page_num + 1,
                        "coordinates": {
                            "x0": widget.rect.x0,
                            "y0": widget.rect.y0,
                            "x1": widget.rect.x1,
                            "y1": widget.rect.y1
                        }
                    })
            
            doc.close()
            return extracted
        except Exception as e:
            print(f"Error extracting PDF fields with fitz: {e}")
            return []

    def fill_pdf(self, file_path: str, data: Dict[str, str], output_path: str):
        """
        Fills a PDF form with the provided data dictionary using PyMuPDF.
        """
        try:
            doc = fitz.open(file_path)
            
            for page in doc:
                for widget in page.widgets():
                    if widget.field_name in data:
                        widget.field_value = str(data[widget.field_name])
                        widget.update()
            
            doc.save(output_path)
            doc.close()
            return True
        except Exception as e:
            print(f"Error filling PDF with fitz: {e}")
            return False
