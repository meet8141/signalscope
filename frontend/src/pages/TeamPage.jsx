import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const PortfolioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 14L21 3" />
    <path d="M21 10v11H3" />
    <path d="M21 3h-7" />
  </svg>
);

const teamMembers = [
  { name: 'Akshar Patel', image: '/images/akshar.png', role: 'Team Leader', linkedin: 'https://linkedin.com/in/akshar-patel-a83611344', github: 'https://github.com/aksharpatel007', portfolio: 'https://aksharpatel007.github.io/Portfolio/' },
  { name: 'Riya Savaliya', image: '/images/riya.png', role: 'QA Contributor', linkedin: 'https://www.linkedin.com/in/riya-savaliya-9032ba382/', github: 'https://github.com/riyasavalia09/', portfolio: '' },
  { name: 'Meet Patel', image: '/images/meet.jpeg', role: 'Core Developer', linkedin: 'https://www.linkedin.com/in/meet-patel-93a3b12a7/', github: 'https://github.com/meet8141', portfolio: 'https://meetpatel8141.vercel.app/' },
  { name: 'Priyal Ramani', image: '/images/priyal.jpeg', role: 'UI/UX Desginer', linkedin: 'https://www.linkedin.com/in/priyal-ramani-197417329/', github: 'https://github.com/priyal63/', portfolio: '' },
  { name: 'Deep Vanani', image: '/images/deep.png', role: 'UI Prototype', linkedin: 'https://www.linkedin.com/in/dip-vanani-754a94362', github: '', portfolio: '' },
  { name: 'Varshil Savaliya', image: '/images/varshil.png', role: 'Helper Hand', linkedin: 'linkedin.com/in/varshil-savaliya-234a8b315', github: '', portfolio: '' },
];

export function TeamPage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-[1400px] mx-auto w-full relative z-10">
      <Link to="/" className="inline-flex items-center gap-2 text-off-white/60 hover:text-acid-lime transition-colors mb-12 font-mono text-sm tracking-wider uppercase">
        <ArrowLeft size={16} />
        Back to Scanner
      </Link>

      <div className="mb-16">
        <h1 className="font-serif text-6xl md:text-8xl font-extralight tracking-tight mb-6">
          The <span className="italic font-light">Engineering</span> Team
        </h1>
        <p className="font-sans text-xl opacity-60 max-w-2xl leading-relaxed">
          Meet the developers behind SignalScope. Built with precision for the Smart India Hackathon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, idx) => {
          const isLeader = member.role === 'Team Leader';
          return (
            <div key={idx} className={`bg-warm-charcoal p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden flex flex-col xl:flex-row items-center xl:items-start gap-6 h-full ${isLeader
              ? 'border-acid-lime shadow-[0_0_30px_rgba(212,242,104,0.15)]'
              : 'border-white/10 hover:border-acid-lime/50'
              }`}>

              <div className="absolute top-0 right-0 w-48 h-48 bg-acid-lime/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>
              {isLeader && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-acid-lime to-transparent opacity-70"></div>
              )}

              {/* Left side: Rectangular Image */}
              <div className={`shrink-0 overflow-hidden rounded-xl border border-white/10 group-hover:border-acid-lime/50 transition-colors w-32 h-40`}>
                <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" />
              </div>

              {/* Right side: Details */}
              <div className="flex flex-col h-full flex-grow text-center xl:text-left py-2 w-full">
                <h4 className={`font-sans font-medium text-off-white group-hover:text-acid-lime transition-colors mb-2 text-2xl`}>{member.name}</h4>

                <div className="font-mono text-sm text-off-white/70 uppercase tracking-widest mb-4 flex items-center justify-center xl:justify-start gap-2 flex-wrap">
                  <span className={isLeader ? "text-acid-lime" : ""}>{member.role}</span>
                </div>

                <div className="flex-grow"></div>

                <div className="flex items-center justify-center xl:justify-start gap-3 mt-auto">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-off-white/80 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all">
                      <LinkedinIcon />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-off-white/80 hover:text-white hover:bg-[#333] hover:border-[#333] transition-all">
                      <GithubIcon />
                    </a>
                  )}
                  {member.portfolio && (
                    <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-off-white/80 hover:text-white hover:bg-acid-lime hover:border-acid-lime hover:text-stone-900 transition-all">
                      <PortfolioIcon />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
