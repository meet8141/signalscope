import React from 'react';
import { ShieldCheck, Activity, Hash, AlertTriangle, Fingerprint, Image as ImageIcon, Cpu } from 'lucide-react';

const ReportTable = ({ title, icon: Icon, data }) => (
  <div className="mb-8" style={{ breakInside: 'avoid' }}>
    <div className="flex items-center gap-2 mb-4 border-b-2 border-stone-800 pb-2">
      {Icon && <Icon className="text-stone-800" size={20} />}
      <h3 className="font-serif text-xl font-bold text-stone-900 uppercase tracking-wide">{title}</h3>
    </div>
    <table className="w-full text-sm font-sans border-collapse">
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-b border-stone-200">
            <td className="py-2 px-4 font-bold text-stone-700 w-1/3 bg-stone-50">{row.label}</td>
            <td className="py-2 px-4 text-stone-900 font-mono break-all">
              {typeof row.value === 'boolean'
                ? (row.value ? <span className="bg-stone-800 text-white px-2 py-1 rounded text-xs">TRUE</span> : <span className="bg-stone-200 text-stone-800 px-2 py-1 rounded text-xs">FALSE</span>)
                : row.value || 'N/A'
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export function FullReportPrint({ results }) {
  if (!results) return null;

  const BASE_URL = import.meta.env.VITE_API_URL || 'https://signalscope-fw9u.onrender.com';
  const realImageUrl = results.model?.image_file ? `${BASE_URL}/static/uploads/${results.model.image_file}` : null;
  const heatmapUrl = results.model?.heatmap_file ? `${BASE_URL}/static/heatmaps/${results.model.heatmap_file}` : null;

  return (
    <div className="hidden print:block w-full bg-white text-stone-900 min-h-screen font-sans">
      <table className="w-full">
        <thead><tr><td><div className="h-4"></div></td></tr></thead>
        <tbody>
          <tr>
            <td className="px-12 pb-4">
              {/* Header */}
      <div className="border-b-4 border-stone-900 pb-6 mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-stone-900">SignalScope Forensic Report</h1>
          </div>
          <p className="font-mono text-sm text-stone-500">Generated on {new Date().toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-bold text-stone-900 uppercase tracking-widest border border-stone-900 px-3 py-1 inline-block mb-2">Confidential</p>
          <p className="font-mono text-xs text-stone-500">Report ID: {results.metadata?.file_info?.md5_hash?.substring(0, 12) || 'Unknown'}</p>
        </div>
      </div>

      {/* Main Images Section */}
      <div className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-stone-900 border-b-2 border-stone-300 pb-2 mb-6 uppercase tracking-wide">1. Analyzed Signals</h2>
        <div className="flex flex-row gap-8 justify-center items-start">
          {realImageUrl && (
            <div className="flex-1 text-center">
              <h3 className="font-mono text-sm uppercase tracking-wider mb-2 font-bold">Original Input</h3>
              <img src={realImageUrl} alt="Original" className="max-w-full h-auto max-h-[350px] mx-auto border-4 border-stone-100 shadow-sm object-contain" style={{ breakInside: 'avoid' }} />
            </div>
          )}
          {heatmapUrl && (
            <div className="flex-1 text-center">
              <h3 className="font-mono text-sm uppercase tracking-wider mb-2 font-bold">GradCAM Heatmap</h3>
              <img src={heatmapUrl} alt="Heatmap" className="max-w-full h-auto max-h-[350px] mx-auto border-4 border-stone-100 shadow-sm object-contain" style={{ breakInside: 'avoid' }} />
            </div>
          )}
        </div>
      </div>

      {/* AI Model Verdict */}
      <div className="mb-12" style={{ breakInside: 'avoid' }}>
        <h2 className="font-serif text-2xl font-bold text-stone-900 border-b-2 border-stone-300 pb-2 mb-6 uppercase tracking-wide">2. AI Model Verdict</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
            <h4 className="font-bold text-lg mb-4 text-stone-800">Probabilities</h4>
            <div className="mb-4">
              <div className="flex justify-between font-mono text-sm mb-1">
                <span>AI Generated</span>
                <span className="font-bold">{(results.model?.ai_probability * 100).toFixed(2)}%</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full"><div className="bg-stone-900 h-full" style={{ width: `${results.model?.ai_probability * 100}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between font-mono text-sm mb-1">
                <span>Authentic (Real)</span>
                <span className="font-bold">{(results.model?.real_probability * 100).toFixed(2)}%</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full"><div className="bg-stone-400 h-full" style={{ width: `${results.model?.real_probability * 100}%` }}></div></div>
            </div>
          </div>
          <div>
            <ReportTable title="Model Info" icon={Activity} data={[
              { label: 'Verdict', value: results.model?.verdict?.toUpperCase() },
              { label: 'GradCAM Layer', value: results.model?.gradcam_layer },
              { label: 'Model Version', value: 'Ensemble v1' }
            ]} />
          </div>
        </div>
      </div>

      {/* Forensics */}
      <div className="mb-12" style={{ breakInside: 'avoid' }}>
        <h2 className="font-serif text-2xl font-bold text-stone-900 border-b-2 border-stone-300 pb-2 mb-6 uppercase tracking-wide">3. Advanced Forensics</h2>

        <div className="grid grid-cols-2 gap-8">
          {results.forensic?.noise_analysis && (
            <ReportTable title="Noise Analysis" icon={Activity} data={[
              { label: 'Manipulation Detected', value: results.forensic.noise_analysis.manipulation_detected },
              { label: 'Max Noise Diff', value: results.forensic.noise_analysis.max_noise_difference?.toFixed(4) ?? results.forensic.noise_analysis.max_noise_difference },
              { label: 'Avg Noise Diff', value: results.forensic.noise_analysis.avg_noise_difference?.toFixed(4) ?? results.forensic.noise_analysis.avg_noise_difference },
            ]} />
          )}

          {results.forensic?.ela_analysis && (
            <ReportTable title="Error Level Analysis" icon={Hash} data={[
              { label: 'Localized Manipulation', value: results.forensic.ela_analysis.localized_manipulation_detected },
              { label: 'Max Block Noise', value: results.forensic.ela_analysis.max_block_noise?.toFixed(4) ?? results.forensic.ela_analysis.max_block_noise },
              { label: 'Anomaly Ratio', value: results.forensic.ela_analysis.anomaly_ratio?.toFixed(4) ?? results.forensic.ela_analysis.anomaly_ratio },
            ]} />
          )}

          {results.forensic?.fft_analysis && (
            <ReportTable title="Frequency Analysis (FFT)" icon={AlertTriangle} data={[
              { label: 'Artifacts Detected', value: results.forensic.fft_analysis.artifacts_detected },
              { label: 'High Freq Energy', value: results.forensic.fft_analysis.high_frequency_energy?.toFixed(2) ?? results.forensic.fft_analysis.high_frequency_energy },
            ]} />
          )}

          {results.forensic?.cfa_artifacts && (
            <ReportTable title="Color Filter Array" icon={ImageIcon} data={[
              { label: 'Pattern Missing / AI', value: results.forensic.cfa_artifacts.cfa_pattern_missing_or_ai },
              { label: 'Avg Correlation', value: results.forensic.cfa_artifacts.avg_cfa_correlation?.toFixed(4) ?? results.forensic.cfa_artifacts.avg_cfa_correlation },
            ]} />
          )}
        </div>
      </div>

      {/* Metadata & C2PA */}
      <div className="mb-12" style={{ breakInside: 'avoid' }}>
        <h2 className="font-serif text-2xl font-bold text-stone-900 border-b-2 border-stone-300 pb-2 mb-6 uppercase tracking-wide">4. File Integrity & Provenance</h2>

        <div className="grid grid-cols-2 gap-8">
          {results.metadata?.file_info && (
            <ReportTable title="File Information" icon={Fingerprint} data={[
              { label: 'File Name', value: results.metadata.file_info.file_name },
              { label: 'File Size', value: `${results.metadata.file_info.file_size_mb} MB` },
              { label: 'Created', value: results.metadata.file_info.created_on ? new Date(results.metadata.file_info.created_on).toLocaleString() : 'N/A' },
              { label: 'MD5 Hash', value: results.metadata.file_info.md5_hash },
              { label: 'SHA256', value: results.metadata.file_info.sha256_hash?.substring(0, 16) + '...' }
            ]} />
          )}

          {results.c2pa && (
            <ReportTable title="C2PA Trace" icon={ShieldCheck} data={[
              { label: 'C2PA Manifest Detected', value: results.c2pa.c2pa_detected },
              { label: 'Status', value: results.c2pa.status?.toUpperCase() },
              { label: 'Message', value: results.c2pa.message },
              { label: 'Confidence', value: results.c2pa.confidence_percentage ? `${results.c2pa.confidence_percentage}%` : 'N/A' }
            ]} />
          )}
        </div>
      </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              <div className="text-center pt-4 pb-4 mx-12 text-stone-400 font-mono text-xs uppercase tracking-widest border-t border-stone-200">
                Created by BuildBeyond
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
