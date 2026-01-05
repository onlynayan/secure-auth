
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCog, User, ChevronRight, ChevronLeft } from 'lucide-react';

const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
    title: "Military Grade Encryption",
    subtitle: "Protecting your digital assets with SHA-256 and TOTP technology."
  },
  {
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2070",
    title: "Zero-Trust Architecture",
    subtitle: "Verification at every step. Your security is our absolute priority."
  },
  {
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070",
    title: "Real-time Monitoring",
    subtitle: "Advanced tracking and logging for all authentication attempts."
  }
];

const PublicLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-slate-950">
      {/* Background Slider */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-40' : 'opacity-0'
          }`}
        >
          <img
            src={slide.url}
            alt="background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        </div>
      ))}

      {/* Main Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6 animate-bounce">
            <div className="bg-indigo-500 p-3 rounded-2xl shadow-lg shadow-indigo-500/50">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            SECURE<span className="text-indigo-500">AUTH</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
            Advanced Identity Management & Two-Factor Authentication Protocol
          </p>
        </div>

        {/* Action Cards (Glassmorphism) */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          <button
            onClick={() => navigate('/login', { state: { role: 'admin' } })}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] text-left transition-all hover:bg-white/10 hover:border-indigo-500/50 hover:translate-y-[-4px]"
          >
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30 group-hover:scale-110 transition-transform">
              <UserCog className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Admin Portal</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Manage system users, view access logs, and configure security parameters.
            </p>
            <div className="flex items-center text-indigo-400 font-bold text-xs uppercase tracking-widest">
              Enter Dashboard <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => navigate('/login', { state: { role: 'user' } })}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] text-left transition-all hover:bg-white/10 hover:border-emerald-500/50 hover:translate-y-[-4px]"
          >
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <User className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">User Access</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Access your secure workspace with multifactor verification.
            </p>
            <div className="flex items-center text-emerald-400 font-bold text-xs uppercase tracking-widest">
              Launch Vault <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 flex gap-3">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentSlide ? 'w-8 bg-indigo-500' : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicLandingPage;
