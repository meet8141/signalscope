import { AlertCircle, CheckCircle2, Fingerprint, Image as ImageIcon, Activity, Hash, AlertTriangle } from 'lucide-react';

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

export function MetadataViewer({ data }) {
  if (!data) return null;
  const { file_info, image_properties } = data;

  return (
    <div className="space-y-12">
      <div>
        <SectionTitle title="File Information" icon={Fingerprint} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <GridItem label="File Name" value={file_info?.file_name} />
          <GridItem label="Size" value={`${file_info?.file_size_mb} MB`} />
          <GridItem label="Created" value={file_info?.created_on ? new Date(file_info.created_on).toLocaleString() : 'N/A'} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <GridItem label="MD5 Hash" value={file_info?.md5_hash} isMono />
          <GridItem label="SHA256 Hash" value={file_info?.sha256_hash} isMono />
        </div>
      </div>

      <div>
        <SectionTitle title="Image Properties" icon={ImageIcon} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GridItem label="Format" value={image_properties?.format} />
          <GridItem label="Color Mode" value={image_properties?.mode} />
          <GridItem label="Dimensions" value={`${image_properties?.width} x ${image_properties?.height}`} />
          <GridItem label="Animated" value={image_properties?.is_animated ? 'Yes' : 'No'} />
        </div>
      </div>
    </div>
  );
}

export function C2PAViewer({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className={`p-6 rounded-xl border flex items-start gap-4 ${data.status === 'success' ? 'bg-acid-lime/10 border-acid-lime/30' : 'bg-red-500/10 border-red-500/30'}`}>
        {data.status === 'success' ? <CheckCircle2 className="text-acid-lime mt-1" /> : <AlertCircle className="text-red-400 mt-1" />}
        <div>
          <h4 className="font-serif text-xl mb-1">{data.status === 'success' ? 'C2PA Manifest Validated' : 'Validation Failed'}</h4>
          <p className="font-mono text-sm opacity-80">{data.message}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BooleanBadge label="C2PA Data Detected" value={data.c2pa_detected} />
        <GridItem label="Confidence" value={`${data.confidence_percentage}%`} />
      </div>
    </div>
  );
}

export function ForensicViewer({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-12">
      {data.noise_analysis && (
        <div>
          <SectionTitle title="Noise & Texture Analysis" icon={Activity} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BooleanBadge label="Manipulation Detected" value={data.noise_analysis.manipulation_detected} invertColors />
            <GridItem label="Max Noise Diff" value={data.noise_analysis.max_noise_difference?.toFixed(2)} />
            <GridItem label="Avg Noise Diff" value={data.noise_analysis.avg_noise_difference?.toFixed(2)} />
            {data.texture_analysis && (
               <>
                 <BooleanBadge label="Anomalous Texture" value={data.texture_analysis.anomalous_texture} invertColors />
                 <GridItem label="Texture Variance" value={data.texture_analysis.texture_variance?.toFixed(2)} />
               </>
            )}
          </div>
        </div>
      )}

      {data.ela_analysis && (
        <div>
          <SectionTitle title="Error Level Analysis (ELA)" icon={Hash} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BooleanBadge label="Localized Manipulation" value={data.ela_analysis.localized_manipulation_detected} invertColors />
            <GridItem label="Max Block Noise" value={data.ela_analysis.max_block_noise?.toFixed(2)} />
            <GridItem label="Anomaly Ratio" value={data.ela_analysis.anomaly_ratio?.toFixed(2)} />
          </div>
        </div>
      )}

       {(data.fft_analysis || data.double_jpeg || data.cfa_artifacts) && (
        <div>
          <SectionTitle title="Advanced Artifacts" icon={AlertTriangle} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.fft_analysis && <BooleanBadge label="FFT Artifacts Detected" value={data.fft_analysis.artifacts_detected} invertColors />}
            {data.double_jpeg && <BooleanBadge label="Double Compression" value={data.double_jpeg.double_compression_suspected} invertColors />}
            {data.cfa_artifacts && <BooleanBadge label="CFA Pattern Missing/AI" value={data.cfa_artifacts.cfa_pattern_missing_or_ai} invertColors />}
          </div>
        </div>
      )}
    </div>
  );
}

export function ModelViewer({ data }) {
  if (!data) return null;

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
    </div>
  );
}
