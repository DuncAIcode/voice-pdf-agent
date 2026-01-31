import fitz

def check_pdf_fields(file_path):
    print(f"Checking fields in: {file_path}")
    try:
        doc = fitz.open(file_path)
        print(f"Total Pages: {len(doc)}")
        found_any = False
        for page_num in range(len(doc)):
            page = doc[page_num]
            widgets = list(page.widgets())
            if widgets:
                print(f"Page {page_num + 1} has {len(widgets)} widgets.")
                for widget in widgets:
                    print(f"  - Name: {widget.field_name}, Label: {widget.field_label}, Type: {widget.field_type_string}")
                found_any = True
        
        if not found_any:
            print("No widgets found in the entire document.")
            
        # Also check for form fields in the catalog
        if doc.is_form_pdf:
             print("Document is a form PDF (has AcroForm block).")
        else:
             print("Document is NOT a form PDF (no AcroForm block).")
             
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_pdf_fields(r"c:\Users\db4sa\Desktop\ANTIGRAVITY\Voice recorder\backend\uploads\C._20Safety_20Committee.pdf.pdf")
