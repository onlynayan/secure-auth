
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, AlertCircle, CheckCircle, Database, Key, Smartphone } from 'lucide-react';
import { dbService } from '../services/dbService';
import { AdminUserRecord, User } from '../types';

const AdminManagePage: React.FC = () => {
  const navigate = useNavigate();
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [customUsers, setCustomUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setAdminUsers(dbService.getAdminUsers());
    const data = localStorage.getItem('secure_auth_custom_db');
    setCustomUsers(data ? JSON.parse(data) : []);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    if (adminUsers.find(u => u.username === newUsername)) {
      setMessage({ type: 'error', text: 'User already exists' });
      return;
    }

    dbService.createAdminUser(newUsername, newPassword);
    refreshData();
    setNewUsername('');
    setNewPassword('');
    setMessage({ type: 'success', text: 'Identity record committed.' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const clearDB = () => {
    if (confirm('ERASE ALL REGISTRY DATA?')) {
      localStorage.clear();
      refreshData();
      window.location.reload();
    }
  };

  return (
    <div className="w-full flex flex-col p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-1">
            <Database className="w-3 h-3" /> Secure Vault Registry
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">Identity & Device Management</h1>
        </div>
        <button
          onClick={clearDB}
          className="w-fit text-[9px] font-black text-red-500/70 hover:text-red-400 uppercase tracking-[0.2em] px-4 py-2 border border-red-500/20 rounded-xl transition-all"
        >
          Factory Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Provisioning Section */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <UserPlus className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="font-bold text-lg text-slate-100 uppercase tracking-tighter">User Provision</h2>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Account ID</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-100 transition-all text-sm"
                placeholder="Unique ID"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-100 transition-all text-sm"
                placeholder="Access Key"
              />
            </div>

            {message.text && (
              <div className={`p-3 rounded-xl text-[10px] font-bold flex items-center gap-2 ${message.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                {message.type === 'error' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg text-xs"
            >
              GENERATE RECORD
            </button>
          </form>
        </div>

        {/* Identity Registry Section */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-xl flex flex-col overflow-x-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-lg">
                <icon Users className="w-4 h-4 text-slate-400" />
              </div>
              <h2 className="font-bold text-lg text-slate-100 uppercase tracking-tighter">Vault Identities</h2>
            </div>
            <div className="text-[9px] font-bold text-slate-500 uppercase">Total: {adminUsers.length}</div>
          </div>

          <div className="min-w-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="pb-3 font-bold text-slate-500 text-[9px] uppercase tracking-widest">User ID</th>
                  <th className="pb-3 font-bold text-slate-500 text-[9px] uppercase tracking-widest">MFA State</th>
                  <th className="pb-3 font-bold text-slate-500 text-[9px] uppercase tracking-widest">Device Sig</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {adminUsers.map((u, i) => {
                  const customUser = customUsers.find(cu => cu.username === u.username);
                  return (
                    <tr key={i} className="group transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-indigo-400 text-sm">{u.username}</div>
                        <div className="text-[8px] text-slate-600 font-mono mt-0.5">{u.password_hash.substring(0, 15)}...</div>
                      </td>
                      <td className="py-4">
                        {customUser?.totp_enabled === 'Y' ? (
                          <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[8px] font-black border border-emerald-500/20 uppercase tracking-tighter">
                            Active
                          </span>
                        ) : (
                          <span className="bg-slate-800 text-slate-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4">
                        {customUser?.registered_device_id ? (
                          <div className="flex items-center gap-2 text-emerald-400/80 font-mono text-[10px]">
                            <Smartphone className="w-3 h-3" /> {customUser.registered_device_id}
                          </div>
                        ) : (
                          <div className="text-slate-700 italic text-[10px]">Unbound</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
        <div className="bg-amber-500/10 p-2 rounded-xl shrink-0">
          <Key className="w-5 h-5 text-amber-500" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-slate-500 leading-tight font-bold uppercase tracking-wide">
            Security Notice: The system now logs the unique Client Signature of the device used for 2FA onboarding. This signature is stored as a 12-bit Hash and is used to verify environment integrity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminManagePage;
