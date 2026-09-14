import { useState, useRef } from 'react';
import { Upload, FileImage, Loader2, AlertTriangle, XCircle } from 'lucide-react';

export function UploadZone({ onUpload, isUploading, results }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const fileInputRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_URL || 'https://signalscope-fw9u.onrender.com';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    setError(null);
    setWarning(null);

    const objectUrl = URL.createObjectURL(file);

    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      setPreviewUrl(objectUrl);
      setShowHeatmap(false);

      if (width > 512 || height > 512) {
        setError(`Image exceeds max resolution of 512x512 (${width}x${height}). The model cannot process this image.`);
      } else {
        if (width > 224 || height > 224) {
          setWarning(`Accuracy may vary for images larger than 224x224 (${width}x${height}).`);
        }
        onUpload(file);
      }
    };
    img.src = objectUrl;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClick = (e) => {
    // Don't trigger file input if clicking the toggle button
    if (e.target.closest('button')) return;
    fileInputRef.current?.click();
  };

  // Determine what image to show
  let displayUrl = previewUrl;
  if (results?.model) {
    if (showHeatmap && results.model.heatmap_file) {
      displayUrl = `${BASE_URL}/static/heatmaps/${results.model.heatmap_file}`;
    } else if (results.model.image_file) {
      displayUrl = `${BASE_URL}/static/uploads/${results.model.image_file}`;
    }
  }

  return (
    <div
      className={`relative w-full max-w-2xl h-full min-h-[400px] rounded-xl overflow-hidden border-2 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer
        ${isDragActive ? 'border-acid-lime bg-acid-lime/5' : 'border-white/10 bg-warm-charcoal hover:border-acid-lime/50'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <div className="absolute top-4 left-4 right-4 z-40 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-start gap-3 backdrop-blur-md shadow-2xl">
          <XCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <p className="font-sans text-sm font-medium">{error}</p>
        </div>
      )}

      {warning && !error && (
        <div className="absolute top-4 left-4 right-4 z-40 bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 p-4 rounded-lg flex items-start gap-3 backdrop-blur-md shadow-2xl">
          <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={18} />
          <p className="font-sans text-sm font-medium">{warning}</p>
        </div>
      )}

      {displayUrl ? (
        <div className="absolute inset-0">
          <img src={displayUrl} alt="Preview" className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-30 grayscale' : 'opacity-80'}`} />
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-black/50 backdrop-blur-sm z-20">
              <Loader2 size={48} className="animate-spin text-acid-lime mb-4" />
              <span className="font-mono text-sm tracking-wider text-off-white animate-pulse">ANALYZING SIGNAL...</span>
            </div>
          )}

          {/* Toggle Button */}
          {results?.model?.heatmap_file && !isUploading && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHeatmap(!showHeatmap);
                }}
                className="bg-stone-black/80 backdrop-blur-md border border-white/20 text-off-white px-6 py-2 rounded-full font-mono text-xs tracking-wider transition-colors hover:bg-acid-lime hover:text-stone-black hover:border-acid-lime flex items-center gap-2"
              >
                {showHeatmap ? 'SHOW ORIGINAL' : 'SHOW HEATMAP'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 rounded-full bg-stone-black border border-white/10 flex items-center justify-center mb-6 text-off-white/50 group-hover:text-acid-lime transition-colors shadow-2xl">
            <Upload size={32} />
          </div>
          <h3 className="font-serif text-3xl mb-2 text-off-white">Drop Image Signal</h3>
          <p className="font-sans text-sm opacity-50 max-w-xs">
            Supports JPG, PNG, WEBP. Drag and drop or click to browse.
          </p>
        </div>
      )}

      {!displayUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-acid-lime/10 to-transparent mix-blend-overlay pointer-events-none"></div>
      )}
    </div>
  );
}
