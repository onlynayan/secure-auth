
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import PasswordResetPage from './pages/PasswordResetPage';
import QRSetupPage from './pages/QRSetupPage';
import OTPVerifyPage from './pages/OTPVerifyPage';
import HomePage from './pages/HomePage';
import AdminManagePage from './pages/AdminManagePage';
import PublicLandingPage from './pages/PublicLandingPage';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isPublic = location.pathname === '/';

  if (isPublic) return null;

  return (
    <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-4 md:px-6 py-4 flex justify-between items-center z-50 h-16 sticky top-0">
      <div className="flex items-center gap-2 font-black text-indigo-500 text-lg md:text-xl tracking-tighter cursor-pointer" onClick={() => window.location.hash = '#/'}>
        <ShieldCheck className="w-6 h-6 md:w-8 h-8" />
        <span className="text-white">SECURE<span className="text-indigo-500">AUTH</span></span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => window.location.hash = '#/'}
          className="text-[9px] md:text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all"
        >
          Exit System
        </button>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen w-full bg-slate-950 text-slate-200 flex flex-col selection:bg-indigo-500/30">
        <Navigation />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<PublicLandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<PasswordResetPage />} />
            <Route path="/setup-qr" element={<QRSetupPage />} />
            <Route path="/otp" element={<OTPVerifyPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/admin" element={<AdminManagePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
