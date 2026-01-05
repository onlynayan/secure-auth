
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, AlertCircle } from 'lucide-react';

const OTPVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const pendingUser = sessionStorage.getItem('pending_auth_user');
    if (!pendingUser) { navigate('/login'); } else { setUsername(pendingUser); }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      sessionStorage.setItem('authenticated_user', username);
      sessionStorage.removeItem('pending_auth_user');
      navigate('/home');
    } else {
      setError('Access denied: Invalid token');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 h-full bg-slate-950 overflow-hidden">
      <div className="max-w-md w-full h-full max-h-[500px] flex flex-col justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-10 shrink-0">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
              <Fingerprint className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Protocol Verification</h1>
            <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest font-bold">
              Confirming ID for <span className="text-blue-400">@{username}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl flex items-center gap-2 mb-6 text-[10px] font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center gap-3">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">Vault Access Code</label>
              <input 
                type="text" 
                maxLength={6}
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-4xl tracking-[0.3em] font-mono font-black py-5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-blue-500/40 focus:outline-none text-blue-400 placeholder:text-slate-900 transition-all"
                placeholder="000000"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg text-xs uppercase tracking-widest"
            >
              Verify Identity
            </button>
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="w-full text-slate-600 text-[10px] font-black uppercase tracking-widest transition-colors hover:text-slate-400"
            >
              Abort Handshake
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerifyPage;
