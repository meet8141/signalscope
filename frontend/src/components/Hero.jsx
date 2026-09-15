import { StickyNoteCTA } from './StickyNoteCTA';
import { UploadZone } from './UploadZone';

export function Hero({ onUpload, isUploading, results, selectedFile }) {
  return (
    <section className="relative min-h-[70vh] pt-8 sm:pt-12 pb-16 sm:pb-20 px-4 sm:px-8 flex items-center max-w-[1400px] mx-auto">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center w-full">

        {/* Left Column (Verdict Section) */}
        <div className="lg:col-span-6 flex justify-center lg:justify-start w-full">
          <StickyNoteCTA results={results} selectedFile={selectedFile} />
        </div>

        {/* Right Column (Image/Upload Zone) */}
        <div className="lg:col-span-6 relative h-[400px] lg:h-[500px] w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-md h-full">
            <UploadZone onUpload={onUpload} isUploading={isUploading} results={results} />
          </div>
        </div>
      </div>
    </section>
  );
}
