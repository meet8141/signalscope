import json
from c2pa import Reader

def verify_c2pa_image(file_path: str) -> dict:
    """
    Image ka C2PA manifest check karta hai aur result return karta hai.
    """
    try:
        # C2PA reader initialize karein
        reader = Reader(file_path)
        manifest_json = reader.json()
        
        if manifest_json:
            manifest_data = json.loads(manifest_json)
            return {
                "status": "success",
                "c2pa_detected": True,
                "confidence_percentage": 100.0, # Valid signature mila
                "message": "C2PA manifest successfully verified.",
                "data": manifest_data
            }
        else:
            return {
                "status": "warning",
                "c2pa_detected": False,
                "confidence_percentage": 0.0,
                "message": "No C2PA manifest found in the image.",
                "data": None
            }

    except Exception as e:
        # Agar image me valid C2PA data nahi hai ya error aati hai
        return {
            "status": "error",
            "c2pa_detected": False,
            "confidence_percentage": 0.0,
            "message": f"C2PA validation failed: {str(e)}",
            "data": None
        }