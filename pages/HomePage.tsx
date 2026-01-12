
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Activity, Lock,
  Cpu, Globe, Zap, ArrowRight, Info, Heart
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [slide, setSlide] = useState(0);

  const infoSlides = [
    { title: "2FA Protocol Active", text: "Protected by industry-standard TOTP technology." },
    { title: "Session Encryption", text: "Data is wrapped in a secure SSL/TLS tunnel." },
    { title: "Privacy Compliance", text: "Zero-knowledge storage protocols active." }
  ];

  useEffect(() => {
    const authUser = sessionStorage.getItem('authenticated_user');
    if (!authUser) {
      navigate('/');
    } else {
      setUser(authUser);
    }
    const timer = setInterval(() => setSlide(s => (s + 1) % infoSlides.length), 5000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('authenticated_user');
    navigate('/');
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col">
        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden mb-6 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 font-bold text-[9px] uppercase tracking-widest mb-4">
                <Activity className="w-3 h-3" /> System Operational
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
                Status: <span className="text-indigo-500 uppercase">Secure</span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xl">
                Verification established for <span className="text-white font-bold">{user}</span>. Your identity is verified through our multi-step authentication protocol.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <button
                  onClick={handleLogout}
                  className="bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-xl active:scale-95"
                >
                  <LogOut className="w-4 h-4" /> TERMINATE SESSION
                </button>
              </div>
            </div>

            {/* Mini Info Slider */}
            <div className="w-full md:w-64 bg-slate-950/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shrink-0">
              <Info className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="font-bold text-white text-sm mb-1">{infoSlides[slide].title}</h4>
              <p className="text-slate-500 text-[11px] leading-tight min-h-[40px]">
                {infoSlides[slide].text}
              </p>
              <div className="flex gap-1 mt-4">
                {infoSlides.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all ${i === slide ? 'w-3 bg-indigo-500' : 'w-1 bg-slate-800'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Lock className="text-indigo-400" />, title: "Vault", value: "Locked" },
            { icon: <Cpu className="text-emerald-400" />, title: "CPU", value: "98% Stable" },
            { icon: <Globe className="text-blue-400" />, title: "Tunnel", value: "Active" },
            { icon: <Zap className="text-amber-400" />, title: "Ping", value: "12ms" },
          ].map((card, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-4 hover:border-slate-700 transition-colors group">
              <div className="bg-slate-950 w-10 h-10 rounded-xl flex items-center justify-center border border-slate-800 shrink-0">
                {React.cloneElement(card.icon as React.ReactElement<any>, { size: 18 })}
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{card.title}</p>
                <h3 className="text-xs md:text-sm font-bold text-white whitespace-nowrap">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 md:p-8 rounded-[2rem] border border-white/5 relative group flex flex-col justify-center min-h-[160px] md:min-h-[200px]">
            <h3 className="text-xl font-bold text-white mb-2">Access Logs</h3>
            <p className="text-slate-400 text-xs mb-6 max-w-xs">Review all secure authentication events and protocol logs.</p>
            <button className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
              Analyze Data <ArrowRight className="w-3 h-3" />
            </button>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
          </div>

          <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-800 relative group flex flex-col justify-center min-h-[160px] md:min-h-[200px]">
            <h3 className="text-xl font-bold text-white mb-2">Security Parameters</h3>
            <p className="text-slate-400 text-xs mb-6 max-w-xs">Adjust verification thresholds and encryption rotation settings.</p>
            <button className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
              Configure Vault <ArrowRight className="w-3 h-3" />
            </button>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-500/5 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-6 pb-6 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-600 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-center md:text-left">Core Security Engine v2.4</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest">
            Developed with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by <span className="text-white">Nayan</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
