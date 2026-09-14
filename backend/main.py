from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import shutil
import os
import sys
import uuid

from contextlib import contextmanager


# ============================================================
# CUSTOM MODULES
# ============================================================

from C2PA.c2pa_checker import verify_c2pa_image
from METADATA.metadata import extract_image_metadata



# Add MODEL directory to sys.path for import
_MODEL_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "MODEL"
)
if _MODEL_DIR not in sys.path:
    sys.path.insert(0, _MODEL_DIR)

from model import predict_image


# ============================================================
# FORENSIC MODULES
# ============================================================

from FORENSIC.noise import analyze_forensics
from FORENSIC.texture import analyze_texture
from FORENSIC.fft import analyze_fft
from FORENSIC.ela import analyze_ela
from FORENSIC.double_jpeg import analyze_double_jpeg
from FORENSIC.cfa_artifacts import analyze_cfa


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="SignalScope Image Verification API",
    description="C2PA, metadata, forensic and AI-detection model image verification API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# STATIC FILE DIRECTORIES
# ============================================================

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

STATIC_DIR = os.path.join(BACKEND_DIR, "static")
UPLOADS_DIR = os.path.join(STATIC_DIR, "uploads")
HEATMAPS_DIR = os.path.join(STATIC_DIR, "heatmaps")

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(HEATMAPS_DIR, exist_ok=True)

app.mount(
    "/static",
    StaticFiles(directory=STATIC_DIR),
    name="static"
)


# ============================================================
# TEMPORARY FILE HANDLER
# ============================================================

@contextmanager
def handle_temp_file(file: UploadFile):

    # Get extension safely
    original_filename = file.filename or "image"

    ext = os.path.splitext(original_filename)[1].lower()

    # Generate random filename
    temp_filename = os.path.join(
        os.getcwd(),
        f"temp_{uuid.uuid4().hex}{ext}"
    )

    try:

        # Save uploaded file
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        yield temp_filename

    finally:

        # Delete temporary file
        if os.path.exists(temp_filename):
            try:
                os.remove(temp_filename)
            except Exception:
                pass


# ============================================================
# TRUST SCORE
# ============================================================

def calculate_trust_score(
    model_result: dict = None,
    c2pa_result: dict = None,
    metadata_result: dict = None,
    forensic_results: dict = None
) -> int:
    """
    Calculates a 0-100 trust score using dynamic weighted signals.

    Dynamic Weights (Mitigates CNN resizing artifacts on large images):
        If pristine metadata is present and noise analysis passes:
            - 10%  Model confidence (Aggressively overridden by EXIF)
            - 70%  Metadata integrity
            - 10%  Noise analysis
            - 10%  C2PA provenance
        Else (Default):
            - 85%  Model confidence
            -  5%  C2PA provenance
            -  5%  Metadata integrity
            -  5%  Noise analysis

    Higher score = more likely authentic / real.
    """

    score = 0.0

    # Extract indicators safely (Fixed dictionary key bugs)
    has_c2pa = False
    if c2pa_result and c2pa_result.get("status") != "failed":
        has_c2pa = bool(c2pa_result.get("c2pa_detected", False))

    has_exif = False
    if metadata_result and metadata_result.get("status") != "failed":
        # Ensure we actually have meaningful EXIF data
        has_exif = bool(metadata_result.get("camera_exif"))
    
    noise_flag = False
    if forensic_results:
        noise_data = forensic_results.get("noise_analysis", {})
        noise_flag = noise_data.get("manipulation_detected", False)
        
    real_prob = 0.0
    if model_result and model_result.get("status") != "failed":
        real_prob = model_result.get("real_probability", 0.0)

    # --------------------------------------------------------
    # DYNAMIC WEIGHTING LOGIC
    # --------------------------------------------------------

    # Aggressive Metadata Override:
    # If the image has intact EXIF data and no noise manipulation detected, 
    # it is highly likely a real photo from a camera.
    # We aggressively reduce the model's weight to prevent resizing artifacts from causing false positives.
    if has_exif and not noise_flag:
        # Dynamic weights: Model 10%, EXIF 70%, Noise 10%, C2PA 10%
        score += real_prob * 10.0
        score += 70.0  # For EXIF
        score += 10.0  # For passing noise
        if has_c2pa:
            score += 10.0
    else:
        # Default weights: Model 85%, C2PA 5%, EXIF 5%, Noise 5%
        score += real_prob * 85.0
        if has_c2pa:
            score += 5.0
        if has_exif:
            score += 5.0
        if not noise_flag:
            score += 5.0

    # Keep score between 0 and 100
    return max(0, min(100, int(round(score))))


# ============================================================
# AUTHENTICATION
# ============================================================

@app.post("/api/auth/")
def authenticate_user():

    return {
        "status": "success",
        "message": "User authenticated",
        "token": "dummy_token_123"
    }


# ============================================================
# GENERAL VERIFICATION
# ============================================================

@app.post("/api/verify/")
def verify_all(file: UploadFile = File(...)):
    """
    Runs all verification systems:

    1. C2PA
    2. Metadata

    4. Forensics
    5. AI Detection Model (MobileNetV2)
    """

    with handle_temp_file(file) as temp_filename:

        results = {}


        # ----------------------------------------------------
        # 1. C2PA
        # ----------------------------------------------------

        try:

            results["c2pa"] = verify_c2pa_image(
                temp_filename
            )

        except Exception as e:

            results["c2pa"] = {
                "status": "failed",
                "error": str(e)
            }


        # ----------------------------------------------------
        # 2. METADATA
        # ----------------------------------------------------

        try:

            results["metadata"] = extract_image_metadata(
                temp_filename
            )

        except Exception as e:

            results["metadata"] = {
                "status": "failed",
                "error": str(e)
            }



        # ----------------------------------------------------
        # 3. FORENSIC ANALYSIS
        # ----------------------------------------------------

        try:

            forensic_data = {

                "noise_analysis":
                    analyze_forensics(temp_filename),

                "texture_analysis":
                    analyze_texture(temp_filename),

                "fft_analysis":
                    analyze_fft(temp_filename),

                "ela_analysis":
                    analyze_ela(temp_filename),

                "double_jpeg":
                    analyze_double_jpeg(temp_filename),

                "cfa_artifacts":
                    analyze_cfa(temp_filename)
            }


            results["forensic"] = forensic_data


        except Exception as e:

            results["forensic"] = {
                "status": "failed",
                "error": str(e)
            }


        # ----------------------------------------------------
        # 5. MODEL PREDICTION (AI vs REAL)
        # ----------------------------------------------------

        try:

            # Save a copy to static/uploads for reference
            unique_id = uuid.uuid4().hex
            original_filename = file.filename or "image"
            ext = os.path.splitext(original_filename)[1].lower()

            upload_filename = f"{unique_id}{ext}"
            upload_path = os.path.join(
                UPLOADS_DIR, upload_filename
            )

            shutil.copy2(temp_filename, upload_path)

            # Heatmap save path
            heatmap_filename = f"{unique_id}_heatmap.png"
            heatmap_path = os.path.join(
                HEATMAPS_DIR, heatmap_filename
            )

            model_result = predict_image(
                upload_path,
                heatmap_save_path=heatmap_path
            )

            # Add file URLs to model result
            model_result["image_file"] = upload_filename
            model_result["heatmap_file"] = (
                heatmap_filename
                if model_result.get("gradcam_available")
                else None
            )

            results["model"] = model_result

        except Exception as e:

            results["model"] = {
                "status": "failed",
                "error": str(e)
            }


        # ----------------------------------------------------
        # 6. TRUST SCORE (weighted: 85% model, 5% c2pa,
        #    5% metadata, 5% noise)
        # ----------------------------------------------------

        results["trust_score"] = calculate_trust_score(
            model_result=results.get("model"),
            c2pa_result=results.get("c2pa"),
            metadata_result=results.get("metadata"),
            forensic_results=results.get("forensic")
        )


        # ----------------------------------------------------
        # FINAL RESPONSE
        # ----------------------------------------------------

        return {

            "filename": file.filename,

            "status": "success",

            "message": "Combined verification completed",

            "results": results
        }


# ============================================================
# C2PA VERIFICATION
# ============================================================

@app.post("/api/verify/c2pa/")
def verify_c2pa(file: UploadFile = File(...)):

    with handle_temp_file(file) as temp_filename:

        try:

            result = verify_c2pa_image(
                temp_filename
            )

            return {

                "filename": file.filename,

                "verification_type": "C2PA",

                "result": result
            }

        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=f"C2PA verification failed: {str(e)}"
            )


# ============================================================
# METADATA VERIFICATION
# ============================================================

@app.post("/api/verify/metadata/")
def verify_metadata(file: UploadFile = File(...)):

    with handle_temp_file(file) as temp_filename:

        try:

            result = extract_image_metadata(
                temp_filename
            )

            return {

                "filename": file.filename,

                "verification_type": "Metadata",

                "result": result
            }

        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=f"Metadata extraction failed: {str(e)}"
            )



# ============================================================
# FORENSIC VERIFICATION
# ============================================================

@app.post("/api/verify/forensic/")
def verify_forensics(file: UploadFile = File(...)):

    with handle_temp_file(file) as temp_filename:

        try:

            forensic_data = {

                "noise_analysis":
                    analyze_forensics(temp_filename),

                "texture_analysis":
                    analyze_texture(temp_filename),

                "fft_analysis":
                    analyze_fft(temp_filename),

                "ela_analysis":
                    analyze_ela(temp_filename),

                "double_jpeg":
                    analyze_double_jpeg(temp_filename),

                "cfa_artifacts":
                    analyze_cfa(temp_filename)
            }


            trust_score = calculate_trust_score(
                forensic_results=forensic_data
            )


            return {

                "filename": file.filename,

                "verification_type": "Forensic",

                "trust_score": trust_score,

                "result": forensic_data
            }


        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=f"Forensic analysis failed: {str(e)}"
            )


# ============================================================
# MODEL VERIFICATION (AI vs REAL)
# ============================================================

@app.post("/api/verify/model/")
def verify_model(
    request: Request,
    file: UploadFile = File(...)
):
    """
    Runs MobileNetV2 AI-detection model on the image.

    - Saves uploaded image to static/uploads/
    - Saves Grad-CAM heatmap to static/heatmaps/
    - Returns AI probability, verdict, and URLs
      to both the uploaded image and heatmap.
    """

    try:

        # Generate unique filename
        original_filename = file.filename or "image"
        ext = os.path.splitext(original_filename)[1].lower()
        unique_id = uuid.uuid4().hex

        # Save uploaded image to static/uploads/
        upload_filename = f"{unique_id}{ext}"
        upload_path = os.path.join(
            UPLOADS_DIR, upload_filename
        )

        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Heatmap save path in static/heatmaps/
        heatmap_filename = f"{unique_id}_heatmap.png"
        heatmap_path = os.path.join(
            HEATMAPS_DIR, heatmap_filename
        )

        # Run model prediction
        result = predict_image(
            upload_path,
            heatmap_save_path=heatmap_path
        )

        # Build URLs for the saved files
        base_url = str(request.base_url).rstrip("/")

        upload_url = (
            f"{base_url}/static/uploads/{upload_filename}"
        )

        heatmap_url = None
        if result.get("gradcam_available"):
            heatmap_url = (
                f"{base_url}/static/heatmaps/{heatmap_filename}"
            )

        return {

            "filename": file.filename,

            "verification_type": "Model",

            "ai_probability": result.get("ai_probability"),

            "real_probability": result.get("real_probability"),

            "verdict": result.get("verdict"),

            "image_url": upload_url,

            "heatmap_url": heatmap_url,

            "result": result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Model verification failed: {str(e)}"
        )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():

    return {
        "status": "online",
        "service": "SignalScope Image Verification API",
        "version": "1.0.0"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )