import { useState } from 'react';
import { AlertCircle, CheckCircle2, Fingerprint, Image as ImageIcon, Activity, Hash, AlertTriangle, Cpu, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

function SectionTitle({ title, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/10">
      {Icon && <Icon className="text-acid-lime" size={20} />}
      <h3 className="font-serif text-2xl font-light text-off-white">{title}</h3>
    </div>
  );
}

function GridItem({ label, value, isMono = false, isAlert = false }) {
  return (
    <div className="flex flex-col bg-stone-black p-4 rounded-lg border border-white/5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-off-white/50 mb-1">{label}</span>
      <span className={`text-sm ${isMono ? 'font-mono' : 'font-sans'} ${isAlert ? 'text-red-400 font-medium' : 'text-off-white'} break-all`}>
        {value?.toString() || 'N/A'}
      </span>
    </div>
  );
}

function BooleanBadge({ label, value, invertColors = false }) {
  const isPositive = invertColors ? !value : value;
  return (
    <div className="flex items-center justify-between bg-stone-black p-4 rounded-lg border border-white/5">
      <span className="font-sans text-sm text-off-white/80">{label}</span>
      {isPositive ? (
        <CheckCircle2 size={18} className="text-acid-lime" />
      ) : (
        <AlertTriangle size={18} className="text-red-400" />
      )}
    </div>
  );
}

function renderDynamicData(obj, knownKeys = [], depth = 0) {
  if (!obj || typeof obj !== 'object') return null;
  return Object.entries(obj).map(([key, value]) => {
    if (depth === 0 && knownKeys.includes(key)) return null;
    if (value === null || value === undefined) return null;

    if (Array.isArray(value)) {
      return (
        <div key={key} className="col-span-full mt-4 p-4 bg-stone-black rounded-lg border border-white/5">
          <span className="font-mono text-xs uppercase tracking-wider text-off-white/50 mb-3 block">{key.replace(/_/g, ' ')}</span>
          <div className="flex flex-wrap gap-2">
            {value.map((item, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-mono text-acid-lime">
                {typeof item === 'object' ? JSON.stringify(item) : String(item)}
              </span>
            ))}
          </div>
        </div>
      );
    }
    
    if (typeof value === 'object') {
      if (Object.keys(value).length === 0) return null;
      return (
        <div key={key} className="col-span-full mt-6 bg-stone-black/30 p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/5">
            <Cpu className="text-acid-lime/50" size={16} />
            <h5 className="font-serif text-xl font-light capitalize text-acid-lime/90">{key.replace(/_/g, ' ')}</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderDynamicData(value, [], depth + 1)}
          </div>
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return <BooleanBadge key={key} label={key.replace(/_/g, ' ')} value={value} />;
    }
    return <GridItem key={key} label={key.replace(/_/g, ' ')} value={String(value)} />;
  });
}

function RawJSONViewer({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="col-span-full mt-12 border border-white/10 rounded-xl overflow-hidden bg-stone-black">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-white/5 transition-colors gap-2"
      >
        <div className="flex items-center gap-3">
          <Hash className="text-acid-lime" size={18} />
          <h3 className="font-serif text-base sm:text-lg font-light text-off-white">Full JSON Response</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-off-white/50">{isOpen ? 'Click to close' : 'Click to open JSON'}</span>
          {isOpen ? <ChevronUp size={16} className="text-off-white/70" /> : <ChevronDown size={16} className="text-off-white/70" />}
        </div>
      </button>
      
      {isOpen && (
        <div className="p-6 border-t border-white/10 relative">
          <button 
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-2 text-xs font-mono text-off-white transition-colors"
          >
            {copied ? <Check size={14} className="text-acid-lime" /> : <Copy size={14} />}
            {copied ? 'COPIED' : 'COPY'}
          </button>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto mt-6">
            <pre className="font-mono text-sm text-acid-lime/80 whitespace-pre-wrap break-words">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export function MetadataViewer({ data }) {
  if (!data) return null;
  const knownKeys = ['file_info', 'image_properties', 'raw_info_dict', 'camera_exif', 'maker_notes', 'interoperability', 'gps_location'];

  return (
    <div className="space-y-12">
      {/* 1. File Information */}
      {data.file_info && (
        <div>
          <SectionTitle title="File Information" icon={Fingerprint} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GridItem label="File Name" value={data.file_info.file_name} />
            <GridItem label="Size" value={`${data.file_info.file_size_mb} MB (${data.file_info.file_size_bytes} bytes)`} />
            <GridItem label="Created" value={data.file_info.created_on ? new Date(data.file_info.created_on).toLocaleString() : 'N/A'} />
            <GridItem label="Modified" value={data.file_info.modified_on ? new Date(data.file_info.modified_on).toLocaleString() : 'N/A'} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <GridItem label="MD5 Hash" value={data.file_info.md5_hash} isMono />
            <GridItem label="SHA256 Hash" value={data.file_info.sha256_hash} isMono />
          </div>
        </div>
      )}

      {/* 2. Image Properties */}
      {data.image_properties && (
        <div>
          <SectionTitle title="Image Properties" icon={ImageIcon} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GridItem label="Format" value={data.image_properties.format} />
            <GridItem label="Color Mode" value={data.image_properties.mode} />
            <GridItem label="Dimensions" value={`${data.image_properties.width} x ${data.image_properties.height}`} />
            <BooleanBadge label="Animated" value={data.image_properties.is_animated} />
            {data.image_properties.frames && <GridItem label="Frames" value={data.image_properties.frames} />}
          </div>
        </div>
      )}

      {/* 3. Raw Info Dictionary */}
      {data.raw_info_dict && Object.keys(data.raw_info_dict).length > 0 && (
        <div>
          <SectionTitle title="Raw File Info" icon={Hash} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {Object.entries(data.raw_info_dict).map(([key, value]) => {
                if (Array.isArray(value)) {
                  return <GridItem key={key} label={key.replace(/_/g, ' ')} value={`[${value.join(', ')}]`} />
                }
                return <GridItem key={key} label={key.replace(/_/g, ' ')} value={value} />
             })}
          </div>
        </div>
      )}

      {/* 4. Camera EXIF */}
      {data.camera_exif && Object.keys(data.camera_exif).length > 0 && (
        <div>
          <SectionTitle title="Camera EXIF" icon={Activity} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderDynamicData(data.camera_exif)}
          </div>
        </div>
      )}

      {/* 5. Maker Notes */}
      {data.maker_notes && Object.keys(data.maker_notes).length > 0 && (
        <div>
          <SectionTitle title="Maker Notes" icon={Cpu} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderDynamicData(data.maker_notes)}
          </div>
        </div>
      )}

      {/* 6. Interoperability */}
      {data.interoperability && Object.keys(data.interoperability).length > 0 && (
        <div>
          <SectionTitle title="Interoperability" icon={Cpu} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderDynamicData(data.interoperability)}
          </div>
        </div>
      )}

      {/* 7. GPS Location */}
      {data.gps_location && Object.keys(data.gps_location).length > 0 && (
        <div>
          <SectionTitle title="GPS Location" icon={Cpu} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderDynamicData(data.gps_location)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderDynamicData(data, knownKeys)}
      </div>
      <RawJSONViewer data={data} />
    </div>
  );
}

export function C2PAViewer({ data }) {
  if (!data) return null;
  const knownKeys = ['status', 'message', 'c2pa_detected', 'confidence_percentage'];

  return (
    <div className="space-y-8">
      <div className={`p-4 sm:p-6 rounded-xl border flex items-start gap-4 ${data.status === 'success' ? 'bg-acid-lime/10 border-acid-lime/30' : 'bg-red-500/10 border-red-500/30'}`}>
        {data.status === 'success' ? <CheckCircle2 className="text-acid-lime mt-1" /> : <AlertCircle className="text-red-400 mt-1" />}
        <div>
          <h4 className="font-serif text-xl mb-1">{data.status === 'success' ? 'C2PA Manifest Validated' : 'Validation Failed'}</h4>
          <p className="font-mono text-sm opacity-80">{data.message}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BooleanBadge label="C2PA Data Detected" value={data.c2pa_detected} />
        {data.confidence_percentage !== undefined && (
          <GridItem label="Confidence" value={`${data.confidence_percentage}%`} />
        )}
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderDynamicData(data, knownKeys)}
      </div>
      <RawJSONViewer data={data} />
    </div>
  );
}

export function ForensicViewer({ data }) {
  if (!data) return null;
  const knownKeys = ['noise_analysis', 'texture_analysis', 'ela_analysis', 'fft_analysis', 'double_jpeg', 'cfa_artifacts'];

  return (
    <div className="space-y-12">
      {/* 1. Noise Analysis */}
      {data.noise_analysis && (
        <div>
          <SectionTitle title="Noise Analysis" icon={Activity} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BooleanBadge label="Manipulation Detected" value={data.noise_analysis.manipulation_detected} invertColors />
            <GridItem label="Max Noise Diff" value={data.noise_analysis.max_noise_difference?.toFixed(2) ?? data.noise_analysis.max_noise_difference} />
            <GridItem label="Avg Noise Diff" value={data.noise_analysis.avg_noise_difference?.toFixed(4) ?? data.noise_analysis.avg_noise_difference} />
          </div>
          {data.noise_analysis.anomalies && data.noise_analysis.anomalies.length > 0 && (
             <div className="mt-4 flex gap-2 flex-wrap">
               {data.noise_analysis.anomalies.map((anom, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-mono">{anom}</span>
               ))}
             </div>
          )}
        </div>
      )}

      {/* 2. Texture Analysis */}
      {data.texture_analysis && (
        <div>
          <SectionTitle title="Texture Analysis" icon={Activity} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BooleanBadge label="Anomalous Texture" value={data.texture_analysis.anomalous_texture} invertColors />
            <GridItem label="Texture Variance" value={data.texture_analysis.texture_variance?.toFixed(2) ?? data.texture_analysis.texture_variance} />
            <GridItem label="Status" value={data.texture_analysis.status} />
          </div>
        </div>
      )}

      {/* 3. ELA Analysis */}
      {data.ela_analysis && (
        <div>
          <SectionTitle title="Error Level Analysis (ELA)" icon={Hash} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BooleanBadge label="Localized Manipulation" value={data.ela_analysis.localized_manipulation_detected} invertColors />
            <GridItem label="Max Block Noise" value={data.ela_analysis.max_block_noise?.toFixed(4) ?? data.ela_analysis.max_block_noise} />
            <GridItem label="Median Block Noise" value={data.ela_analysis.median_block_noise?.toFixed(4) ?? data.ela_analysis.median_block_noise} />
            <GridItem label="Anomaly Ratio" value={data.ela_analysis.anomaly_ratio?.toFixed(4) ?? data.ela_analysis.anomaly_ratio} />
          </div>
        </div>
      )}

      {/* 4. FFT Analysis */}
      {data.fft_analysis && (
        <div>
          <SectionTitle title="FFT Analysis" icon={AlertTriangle} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BooleanBadge label="Artifacts Detected" value={data.fft_analysis.artifacts_detected} invertColors />
            <GridItem label="High Freq Energy" value={data.fft_analysis.high_frequency_energy?.toFixed(2) ?? data.fft_analysis.high_frequency_energy} />
            <GridItem label="Status" value={data.fft_analysis.status} />
          </div>
        </div>
      )}

      {/* 5. Double JPEG Compression */}
      {data.double_jpeg && (
        <div>
          <SectionTitle title="Compression Analysis" icon={Hash} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BooleanBadge label="Double Compression" value={data.double_jpeg.double_compression_suspected} invertColors />
            <GridItem label="Horiz Blocking" value={data.double_jpeg.horizontal_blocking_ratio?.toFixed(4) ?? data.double_jpeg.horizontal_blocking_ratio} />
            <GridItem label="Vert Blocking" value={data.double_jpeg.vertical_blocking_ratio?.toFixed(4) ?? data.double_jpeg.vertical_blocking_ratio} />
          </div>
        </div>
      )}

      {/* 6. CFA Artifacts */}
      {data.cfa_artifacts && (
        <div>
          <SectionTitle title="Color Filter Array" icon={ImageIcon} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BooleanBadge label="Pattern Missing/AI" value={data.cfa_artifacts.cfa_pattern_missing_or_ai} invertColors />
            <GridItem label="Correlation GR" value={data.cfa_artifacts.cfa_correlation_gr?.toFixed(4) ?? data.cfa_artifacts.cfa_correlation_gr} />
            <GridItem label="Correlation GB" value={data.cfa_artifacts.cfa_correlation_gb?.toFixed(4) ?? data.cfa_artifacts.cfa_correlation_gb} />
            <GridItem label="Avg Correlation" value={data.cfa_artifacts.avg_cfa_correlation?.toFixed(4) ?? data.cfa_artifacts.avg_cfa_correlation} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderDynamicData(data, knownKeys)}
      </div>
      <RawJSONViewer data={data} />
    </div>
  );
}

export function ModelViewer({ data }) {
  if (!data) return null;
  const knownKeys = ['ai_probability', 'real_probability', 'disclaimer', 'gradcam_available', 'gradcam_layer', 'heatmap_file', 'image_file', 'verdict'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-stone-black border border-white/10 rounded-xl p-8">
           <h4 className="font-serif text-2xl mb-6">Model Probabilities</h4>
           <div className="space-y-6">
              <div>
                <div className="flex justify-between font-mono text-sm mb-2 opacity-70">
                  <span>AI Generated</span>
                  <span>{(data.ai_probability * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-warm-charcoal h-3 rounded-full overflow-hidden">
                  <div className="bg-acid-lime h-full" style={{ width: `${data.ai_probability * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-mono text-sm mb-2 opacity-70">
                  <span>Authentic (Real)</span>
                  <span>{(data.real_probability * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-warm-charcoal h-3 rounded-full overflow-hidden">
                  <div className="bg-off-white h-full" style={{ width: `${data.real_probability * 100}%` }}></div>
                </div>
              </div>
           </div>
           
           <p className="mt-8 font-sans text-sm opacity-50 italic">
             {data.disclaimer}
           </p>
        </div>

        <div className="space-y-4">
          <SectionTitle title="GradCAM Analysis" />
          <GridItem label="GradCAM Available" value={data.gradcam_available ? 'Yes' : 'No'} />
          <GridItem label="Target Layer" value={data.gradcam_layer} isMono />
          {data.heatmap_file && (
             <div className="mt-4 p-4 bg-stone-black rounded-lg border border-white/5 flex items-center justify-between">
                <span className="font-sans text-sm opacity-80">Heatmap Generated</span>
                <span className="font-mono text-xs text-acid-lime">{data.heatmap_file}</span>
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderDynamicData(data, knownKeys)}
      </div>
      <RawJSONViewer data={data} />
    </div>
  );
}
