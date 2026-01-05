
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, Key, Smartphone } from 'lucide-react';
import { dbService } from '../services/dbService';

const QRSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, passwordHash } = (location.state as any) || {};

  const [secret, setSecret] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deviceSig, setDeviceSig] = useState('');

  useEffect(() => {
    if (!username) { navigate('/login'); return; }
    
    const user = dbService.getCustomUser(username);
    setDeviceSig(dbService.getDeviceFingerprint());

    if (user?.totp_secret) {
      setSecret(user.totp_secret);
    } else {
      const newSecret = dbService.generateSecret(username, passwordHash);
      setSecret(newSecret);
      if (user) {
        dbService.saveCustomUser({ ...user, totp_secret: newSecret });
      }
    }
  }, [username, passwordHash, navigate]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      const user = dbService.getCustomUser(username);
      if (user) {
        // Save TOTP enabled AND the captured device fingerprint
        dbService.saveCustomUser({ 
          ...user, 
          totp_enabled: 'Y',
          registered_device_id: deviceSig 
        });
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
    } else {
      setError('Verification failed: Enter 6 digits');
    }
  };

  const otpAuthUrl = `otpauth://totp/SecureAuth:${username}?secret=${secret}&issuer=SecureAuth`;

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 h-full bg-slate-950">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Handshake Complete</h2>
          <p className="text-slate-400 mt-2 text-[10px] font-bold uppercase tracking-widest">Device ID Registered: {deviceSig}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 h-full overflow-hidden bg-slate-950">
      <div className="max-w-4xl w-full flex flex-col h-full max-h-[700px]">
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-colors text-[10px] font-black uppercase tracking-widest shrink-0"
        >
          <ArrowLeft className="w-3 h-3" /> Abort Setup
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row flex-1 min-h-0">
          <div className="lg:w-1/2 bg-slate-950 p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="bg-white p-4 rounded-[1.5rem] shadow-2xl shadow-indigo-500/10 mb-6 shrink-0 transform hover:scale-105 transition-transform duration-500">
              {secret && <QRCodeSVG value={otpAuthUrl} size={180} level="M" />}
            </div>
            <div className="w-full max-w-[220px] space-y-3">
              <div>
                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] block text-center mb-1">Base32 Secret</label>
                <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-[11px] font-mono text-indigo-400 text-center break-all flex items-center justify-center gap-2">
                  {secret}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 bg-indigo-500/5 border border-indigo-500/10 py-2 px-3 rounded-xl">
                <Smartphone className="w-3 h-3 text-indigo-400" />
                <span className="text-[9px] font-black text-indigo-400/80 uppercase tracking-widest">Sig: {deviceSig}</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <ShieldCheck className="w-6 h-6 text-indigo-500" />
              <h2 className="font-bold text-xl text-white uppercase tracking-tighter">Secure Onboarding</h2>
            </div>
            
            <div className="space-y-4 mb-8 text-[11px] text-slate-400 font-medium uppercase tracking-wide">
              <p className="flex gap-2">1. Use any TOTP Authenticator to scan.</p>
              <p className="flex gap-2">2. This device environment will be registered.</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Confirmation Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-4xl tracking-[0.4em] font-mono font-black px-4 py-4 rounded-2xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-indigo-400"
                  placeholder="000000"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-400 text-[10px] py-2 px-3 rounded-xl border border-red-500/20 flex items-center gap-2 font-bold uppercase">
                  <AlertCircle className="w-3 h-3" /> {error}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-xl text-xs uppercase tracking-widest"
              >
                LINK & ACTIVATE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRSetupPage;
