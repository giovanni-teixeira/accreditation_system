'use client';

import React, { useState, useEffect } from 'react';
import { AuthService } from '@/services/AuthService';

interface LoginOverlayProps {
    onLoginSuccess: (publicKey: string) => void;
}

export const LoginOverlay: React.FC<LoginOverlayProps> = ({ onLoginSuccess }) => {
    const [loginForm, setLoginForm] = useState({ login: '', senha: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowInstallBtn(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await AuthService.login(loginForm.login, loginForm.senha);
            onLoginSuccess(data.publicKey);
        } catch (err: any) {
            setError(err.message || 'Credenciais inválidas.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
            <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded-[24px] p-8 shadow-2xl text-center">
                
                {/* Logo no Topo */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-[160px] h-[80px]">
                        <img 
                            src="/scanner/img/logo.jpg" 
                            alt="Alta Café" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <h2 className="text-4xl font-bold mb-2 text-[#5D4037] tracking-tight">Login</h2>
                <p className="text-sm text-slate-500 mb-8">Portaria Alta Café</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium animate-slide-up text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Usuário</label>
                        <input
                            type="text"
                            required
                            className="p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-medium focus:border-primary-green focus:bg-white focus:outline-none transition-all"
                            value={loginForm.login}
                            onChange={e => setLoginForm(prev => ({ ...prev, login: e.target.value }))}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Senha</label>
                        <input
                            type="password"
                            required
                            className="p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-medium focus:border-primary-green focus:bg-white focus:outline-none transition-all"
                            value={loginForm.senha}
                            onChange={e => setLoginForm(prev => ({ ...prev, senha: e.target.value }))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 p-4 bg-gradient-to-r from-primary-green to-dark-green text-white font-bold rounded-xl shadow-lg shadow-primary-green/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isLoading ? 'Conectando...' : 'Entrar no Scanner'}
                    </button>

                    {showInstallBtn && (
                        <button
                            type="button"
                            onClick={handleInstallClick}
                            className="mt-2 p-3 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Instalar Aplicativo (PWA)
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};
