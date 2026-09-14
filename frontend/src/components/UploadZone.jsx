import { useState, useRef } from 'react';
import { Upload, FileImage, Loader2 } from 'lucide-react';

export function UploadZone({ onUpload, isUploading, results }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
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
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setShowHeatmap(false);
    
    // Pass to parent
    onUpload(file);
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
      className={`relative w-full max-w-2xl h-full min-h-[400px] rounded-t-arch rounded-b-none overflow-hidden border-2 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer
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
