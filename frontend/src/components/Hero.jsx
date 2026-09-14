import { StickyNoteCTA } from './StickyNoteCTA';
import { UploadZone } from './UploadZone';

export function Hero({ onUpload, isUploading, results }) {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-8 flex items-center max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
        
        {/* Left Column (5/12 ratio) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h1 className="font-serif text-6xl md:text-8xl font-extralight leading-[0.9] tracking-tight mb-8">
            Digital <br />
            <span className="italic font-light text-off-white">Naturalism</span>
          </h1>
          
          <p className="font-sans text-xl opacity-60 max-w-md mb-12 leading-relaxed">
            Advanced forensic verification systems built for the modern edge. Analyze, authenticate, and secure media with brutalist precision.
          </p>
          
          {/* Social Proof */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-stone-black bg-warm-charcoal overflow-hidden grayscale opacity-70 transition-all hover:grayscale-0 hover:opacity-100 hover:z-10"
                >
                  <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="font-sans text-sm opacity-60">
              <strong className="block font-medium text-off-white opacity-100">Trusted by</strong>
              Over 2,000 analysts
            </div>
          </div>
        </div>

        {/* Right Column (7/12 ratio) */}
        <div className="lg:col-span-7 relative h-[600px] lg:h-[800px] w-full flex justify-end">
          <UploadZone onUpload={onUpload} isUploading={isUploading} results={results} />
          <StickyNoteCTA results={results} />
        </div>
      </div>
    </section>
  );
}
