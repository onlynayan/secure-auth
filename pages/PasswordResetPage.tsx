
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, CheckCircle, AlertCircle, KeyRound, Lock } from 'lucide-react';
import { dbService } from '../services/dbService';

const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, oldPassword } = (location.state as any) || {};

  const [form, setForm] = useState({ old: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!username) navigate('/login');
    if (oldPassword) setForm(f => ({ ...f, old: oldPassword }));
  }, [username, oldPassword, navigate]);

  const validatePassword = (pass: string) => {
    const hasCapital = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasSpecial = /[@$!%*?&]/.test(pass);
    return hasCapital && hasNumber && hasSpecial && pass.length >= 8;
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.old !== oldPassword) {
      setError('Incorrect current password.');
      return;
    }

    if (!validatePassword(form.new)) {
      setError('Password must contain a capital letter, number, and special character.');
      return;
    }

    if (form.new !== form.confirm) {
      setError('Confirmation does not match new password.');
      return;
    }

    // Commit change
    const newHash = dbService.hashPassword(form.new);
    const user = dbService.getCustomUser(username);
    if (user) {
      // Update both stores to maintain consistency
      dbService.saveCustomUser({ 
        ...user, 
        password_hash: newHash, 
        password_reset_required: false 
      });
      dbService.updateAdminPassword(username, newHash);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/setup-qr', { state: { username, passwordHash: newHash } });
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 h-full bg-slate-950">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Security Updated</h2>
          <p className="text-slate-400 mt-2 text-sm font-bold uppercase tracking-widest">Protocol Reset Successful</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 h-full overflow-hidden bg-slate-950">
      <div className="max-w-md w-full flex flex-col h-full max-h-[650px] justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden shrink-0">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
              <ShieldAlert className="w-7 h-7 text-amber-500" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase">Initial Access Reset</h1>
            <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest font-bold">
              Update temporary credentials for <span className="text-amber-500">@{username}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl flex items-center gap-2 mb-6 text-[10px] font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Current Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={form.old}
                  onChange={(e) => setForm({ ...form, old: e.target.value })}
                  className="w-full bg-slate-950 px-4 py-3 pl-10 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-100 text-sm"
                  placeholder="Old Key"
                  required
                />
                <Lock className="w-4 h-4 text-slate-700 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={form.new}
                  onChange={(e) => setForm({ ...form, new: e.target.value })}
                  className="w-full bg-slate-950 px-4 py-3 pl-10 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-100 text-sm"
                  placeholder="New Secure Key"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-700 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Confirm New Password</label>
              <input 
                type="password" 
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-100 text-sm"
                placeholder="Repeat Key"
                required
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest"
              >
                Update Credentials
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Requirements:</h4>
            <ul className="text-[8px] text-slate-600 space-y-1 font-bold uppercase tracking-wider">
              <li className={/[A-Z]/.test(form.new) ? 'text-emerald-500' : ''}>• At least one Capital letter</li>
              <li className={/\d/.test(form.new) ? 'text-emerald-500' : ''}>• At least one numeric digit</li>
              <li className={/[@$!%*?&]/.test(form.new) ? 'text-emerald-500' : ''}>• At least one special character</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
