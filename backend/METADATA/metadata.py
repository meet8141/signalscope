import os
import json
import hashlib
import io
from datetime import datetime
from PIL import Image, ExifTags, ImageCms
from PIL.ExifTags import GPSTAGS, TAGS, IFD

def get_file_hashes(file_path):
    """File ka MD5 aur SHA256 hash generate karta hai (Digital Fingerprint)"""
    md5_hash = hashlib.md5()
    sha256_hash = hashlib.sha256()
    try:
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                md5_hash.update(chunk)
                sha256_hash.update(chunk)
        return md5_hash.hexdigest(), sha256_hash.hexdigest()
    except Exception:
        return None, None

def _convert_to_degrees(value):
    """GPS coordinates ko Decimal Degrees me convert karta hai"""
    if value is None:
        return None
    try:
        d0 = value[0][0] / value[0][1] if isinstance(value[0], tuple) else float(value[0])
        d1 = value[1][0] / value[1][1] if isinstance(value[1], tuple) else float(value[1])
        d2 = value[2][0] / value[2][1] if isinstance(value[2], tuple) else float(value[2])
        return d0 + (d1 / 60.0) + (d2 / 3600.0)
    except Exception:
        return None

def _clean_value(val):
    """Data ko JSON-friendly format me clean karta hai"""
    if isinstance(val, bytes):
        try:
            return val.decode("utf-8", errors="ignore").strip('\x00')
        except Exception:
            return f"<Binary Data: {len(val)} bytes>"
    elif isinstance(val, (int, float, str)):
        return val
    elif isinstance(val, tuple):
        return tuple(_clean_value(v) for v in val)
    elif isinstance(val, dict):
        return {str(k): _clean_value(v) for k, v in val.items()}
    else:
        return str(val)

def extract_image_metadata(file_path: str):
    """
    Extracts all possible file, image, EXIF, IFD, GPS, XMP, ICC, and Hash metadata.
    """
    metadata = {
        "file_info": {},
        "image_properties": {},
        "raw_info_dict": {},
        "camera_exif": {},
        "maker_notes": {},
        "interoperability": {},
        "gps_location": {}
    }

    try:
        # 1. File Level Info & Hashes
        file_stats = os.stat(file_path)
        md5_hash, sha256_hash = get_file_hashes(file_path)
        
        metadata["file_info"] = {
            "file_name": os.path.basename(file_path),
            "file_size_bytes": file_stats.st_size,
            "file_size_mb": round(file_stats.st_size / (1024 * 1024), 2),
            "created_on": datetime.fromtimestamp(file_stats.st_ctime).isoformat(),
            "modified_on": datetime.fromtimestamp(file_stats.st_mtime).isoformat(),
            "md5_hash": md5_hash,
            "sha256_hash": sha256_hash
        }

        # 2. Open Image for Deep Inspection
        with Image.open(file_path) as img:
            metadata["image_properties"] = {
                "format": img.format,
                "mode": img.mode,
                "width": img.width,
                "height": img.height,
                "is_animated": getattr(img, "is_animated", False),
                "frames": getattr(img, "n_frames", 1)
            }

            # 3. Deep Image Info (ICC Profile Decode, XMP, etc.)
            for key, val in img.info.items():
                if key == "icc_profile":
                    metadata["raw_info_dict"][key] = f"Present ({len(val)} bytes)"
                    # Try to decode ICC Profile Name
                    try:
                        icc_io = io.BytesIO(val)
                        icc_prof = ImageCms.ImageCmsProfile(icc_io)
                        metadata["image_properties"]["color_profile_name"] = ImageCms.getProfileDescription(icc_prof)
                    except Exception:
                        metadata["image_properties"]["color_profile_name"] = "Unknown or Unreadable"
                else:
                    metadata["raw_info_dict"][key] = _clean_value(val)

            # Extract XMP/Adobe metadata if present
            if hasattr(img, 'getxmp'):
                try:
                    xmp_data = img.getxmp()
                    if xmp_data:
                        metadata["raw_info_dict"]["xmp_parsed"] = _clean_value(xmp_data)
                except Exception:
                    pass

            # 4. Extract all EXIF IFDs
            exif = img.getexif()
            if exif:
                # Embedded Thumbnail Check (Tag 514 is Thumbnail size)
                if 514 in exif:
                    metadata["image_properties"]["embedded_thumbnail"] = f"Yes, size: {exif[514]} bytes"
                else:
                    metadata["image_properties"]["embedded_thumbnail"] = "No"

                for tag_id, value in exif.items():
                    tag_name = TAGS.get(tag_id, tag_id)
                    metadata["camera_exif"][tag_name] = _clean_value(value)

                exif_ifd = exif.get_ifd(IFD.Exif)
                for tag_id, value in exif_ifd.items():
                    tag_name = TAGS.get(tag_id, tag_id)
                    metadata["camera_exif"][f"Exif_{tag_name}"] = _clean_value(value)

                maker_ifd = exif.get_ifd(IFD.Makernote)
                for tag_id, value in maker_ifd.items():
                    metadata["maker_notes"][f"Tag_{tag_id}"] = _clean_value(value)

                interop_ifd = exif.get_ifd(IFD.Interop)
                for tag_id, value in interop_ifd.items():
                    metadata["interoperability"][f"Tag_{tag_id}"] = _clean_value(value)

                # --- GPS EXTRACTION (With Safety Fallback) ---
                gps_ifd = exif.get_ifd(IFD.GPSInfo)
                
                # Fallback: Agar naye method se nahi mila toh purane se try karo
                if not gps_ifd and hasattr(img, '_getexif'):
                    old_exif = img._getexif()
                    if old_exif and 34853 in old_exif:
                        gps_ifd = old_exif[34853]

                if gps_ifd:
                    gps_info = {}
                    for tag_id, value in gps_ifd.items():
                        gps_tag = GPSTAGS.get(tag_id, tag_id)
                        gps_info[gps_tag] = value

                    lat = None
                    lon = None
                    
                    if "GPSLatitude" in gps_info and "GPSLatitudeRef" in gps_info:
                        lat = _convert_to_degrees(gps_info["GPSLatitude"])
                        if lat is not None and gps_info["GPSLatitudeRef"] != "N":
                            lat = -lat
                            
                    if "GPSLongitude" in gps_info and "GPSLongitudeRef" in gps_info:
                        lon = _convert_to_degrees(gps_info["GPSLongitude"])
                        if lon is not None and gps_info["GPSLongitudeRef"] != "E":
                            lon = -lon

                    metadata["gps_location"] = {
                        "latitude": lat,
                        "longitude": lon,
                        "altitude": _clean_value(gps_info.get("GPSAltitude")),
                        "google_maps_link": f"https://www.google.com/maps?q={lat},{lon}" if lat is not None and lon is not None else None,
                        "raw_gps_data": {str(k): _clean_value(v) for k, v in gps_info.items()}
                    }

    except Exception as e:
        metadata["error"] = str(e)

    return metadata

# --- TEST SCRIPT ---
if __name__ == "__main__":
    sample_img = "test_image.jpg" # Yahan apni image ka naam dalein
    if os.path.exists(sample_img):
        print(f"Extracting metadata from {sample_img}...\n")
        result = extract_image_metadata(sample_img)
        print(json.dumps(result, indent=4))
    else:
        print(f"File '{sample_img}' nahi mili. Kripya image ka sahi path dalein.")