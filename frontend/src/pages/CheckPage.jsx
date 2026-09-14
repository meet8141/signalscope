import { useState } from 'react';
import { Hero } from '../components/Hero';
import { TabbedContent } from '../components/TabbedContent';
import { FullReportPrint } from '../components/FullReportPrint';
import { api } from '../api/client';

export function CheckPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async (file) => {
    setIsUploading(true);
    setResults(null);
    setSelectedFile(file);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.verify(formData);
      
      const data = response.results || response;
      setResults({
        c2pa: data.c2pa,
        metadata: data.metadata,
        forensic: data.forensic,
        model: data.model,
        trust_score: data.trust_score,
      });

      // Scroll to results
      document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error("Upload failed", error);
      alert(`Verification failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <FullReportPrint results={results} />
      <div className="pt-20 print:hidden">
        <Hero onUpload={handleUpload} isUploading={isUploading} results={results} selectedFile={selectedFile} />
        <TabbedContent results={results} />
      </div>
    </>
  );
}
