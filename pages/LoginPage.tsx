
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { dbService } from '../services/dbService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state as any)?.role || 'user';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const inputHash = dbService.hashPassword(password);
    const adminUsers = dbService.getAdminUsers();

    const adminRecord = adminUsers.find(u => u.username === username && u.password_hash === inputHash);

    if (!adminRecord) {
      setError('Credentials are wrong');
      return;
    }

    if (role === 'admin' && username !== 'admin') {
      setError('Unauthorized for Admin Portal');
      return;
    }

    if (role === 'admin') {
      navigate('/admin');
      return;
    }

    let existingUser = dbService.getCustomUser(username);

    if (!existingUser) {
      existingUser = {
        username,
        password_hash: inputHash,
        totp_enabled: 'N' as const,
        password_reset_required: true,
        createdAt: new Date().toISOString()
      };
      dbService.saveCustomUser(existingUser);
    }

    if (existingUser.password_reset_required) {
      navigate('/reset-password', { state: { username, oldPassword: password } });
      return;
    }

    if (existingUser.totp_enabled === 'N') {
      navigate('/setup-qr', { state: { username, passwordHash: existingUser.password_hash } });
      return;
    }

    sessionStorage.setItem('pending_auth_user', username);
    navigate('/otp');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 bg-slate-950">
      <div className="max-w-md w-full flex flex-col">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-colors text-xs font-black uppercase tracking-widest self-start"
        >
          <ArrowLeft className="w-4 h-4" /> Exit to Public
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 relative overflow-hidden">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${role === 'admin' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-indigo-500/10 border-indigo-500/20'
              }`}>
              <Shield className={`w-7 h-7 ${role === 'admin' ? 'text-amber-500' : 'text-indigo-500'}`} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
              {role === 'admin' ? 'Admin Gateway' : 'User Vault'}
            </h1>
            <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest font-bold">
              Secure Credential Exchange
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl flex items-center gap-2 mb-6 text-[11px] font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-100 transition-all text-sm"
                placeholder="Enter ID"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-100 transition-all text-sm"
                placeholder="Enter Access Key"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95 mt-2 ${role === 'admin' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'
                }`}
            >
              AUTHENTICATE
            </button>
          </form>

          {role === 'admin' && (
            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                Protected Registry Protocol
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
