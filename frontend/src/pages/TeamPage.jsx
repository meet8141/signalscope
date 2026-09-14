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
  { name: 'Akshar Patel', role: 'Team Leader', linkedin: 'https://linkedin.com/in/akshar-patel-a83611344', github: 'https://github.com/aksharpatel007', portfolio: 'https://aksharpatel007.github.io/Portfolio/' },
  { name: 'Meet Patel', role: 'Developer', linkedin: 'https://www.linkedin.com/in/meet-patel-93a3b12a7/', github: 'https://github.com/meet8141', portfolio: 'https://meetpatel8141.vercel.app/' },
  { name: 'Riya Savaliya', role: 'Developer', linkedin: 'https://www.linkedin.com/in/riya-savaliya-9032ba382/', github: 'https://github.com/riyasavalia09/', portfolio: '' },
  { name: 'Priyal Ramani', role: 'Developer', linkedin: 'https://www.linkedin.com/in/priyal-ramani-197417329/', github: 'https://github.com/priyal63/', portfolio: '' },
  { name: 'Varshil Savaliya', role: 'Developer', linkedin: '', github: '', portfolio: '' },
  { name: 'Deep Vanani', role: 'Developer', linkedin: '', github: '', portfolio: '' },
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="bg-warm-charcoal p-8 rounded-2xl border border-white/10 hover:border-acid-lime/50 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-acid-lime/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>

            <h4 className="font-sans font-medium text-2xl text-off-white mb-2 group-hover:text-acid-lime transition-colors">{member.name}</h4>
            <p className="font-mono text-sm text-off-white/50 uppercase tracking-widest mb-8">{member.role}</p>

            <div className="flex items-center gap-4">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-off-white/80 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all">
                <LinkedinIcon />
              </a>
              <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-off-white/80 hover:text-white hover:bg-[#333] hover:border-[#333] transition-all">
                <GithubIcon />
              </a>
              {member.portfolio && (
                <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-off-white/80 hover:text-white hover:bg-acid-lime hover:border-acid-lime transition-all">
                  <PortfolioIcon />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
