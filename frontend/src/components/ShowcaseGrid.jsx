export function ShowcaseGrid() {
  const showcaseItems = [
    { id: '1A', title: 'Spatial Artifacts', image: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1000&auto=format&fit=crop', offset: false },
    { id: '1B', title: 'Noise Profile', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop', offset: true },
    { id: '1C', title: 'Deepfake Vector', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', offset: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {showcaseItems.map((item, idx) => (
        <div 
          key={item.id} 
          className={`flex flex-col gap-4 ${item.offset ? 'md:translate-y-12' : ''}`}
        >
          {/* Card Image Container */}
          <div className="relative aspect-[3/4] bg-[#292524] rounded-xl overflow-hidden group cursor-pointer border border-white/5">
            {/* Catalog Label */}
            <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md rounded-md px-3 py-2 border border-white/10 flex items-center gap-3">
              <span className="font-mono text-[10px] text-off-white/80">Fig. {item.id}</span>
              <div className="w-2 h-2 rounded-full bg-acid-lime animate-pulse"></div>
            </div>
            
            {/* Image with grayscale transition */}
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <button className="w-full py-3 bg-white/10 backdrop-blur-md rounded-lg text-sm font-medium hover:bg-acid-lime hover:text-stone-black transition-colors border border-white/20">
                Run Diagnostics
              </button>
            </div>
          </div>
          
          {/* Title */}
          <h4 className="font-serif italic text-2xl px-2">{item.title}</h4>
        </div>
      ))}
    </div>
  );
}
