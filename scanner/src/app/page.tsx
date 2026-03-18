'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AuthService } from '@/services/AuthService';
import { ScannerCamera } from '@/components/scanner/ScannerCamera';
import { LoginOverlay } from '@/components/scanner/LoginOverlay';
import { StatusOverlay, FlashEffect } from '@/components/scanner/StatusOverlay';
import { useScanner } from '@/hooks/useScanner';

export default function ScannerPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [publicKey, setPublicKey] = useState('');
    const [isClient, setIsClient] = useState(false);

    const {
        scanState,
        isPaused,
        flashActive,
        onDetect,
        resetScanner
    } = useScanner(publicKey);

    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        setIsClient(true);
        const session = AuthService.getSession();
        if (session.token && session.publicKey) {
            setPublicKey(session.publicKey);
            setIsLoggedIn(true);
        }

        // Registrar Service Worker para PWA (Melhora a "instalabilidade")
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/scanner/sw.js')
                    .then(reg => console.log('SW registrado:', reg.scope))
                    .catch(err => console.error('Erro SW:', err));
            });
        }

        // --- MELHORIAS DE SINCRONIZAÇÃO SOLICITADAS ---
        
        // 1. Sincronizar ao abrir o app
        const performInitialSync = async () => {
            const SyncService = (await import('@/services/SyncService')).default;
            await SyncService.processQueue();
            updatePendingCount();
        };
        performInitialSync();

        // 2. Sincronizar ao voltar a internet (online)
        window.addEventListener('online', performInitialSync);

        // 3. Sincronizar periodicamente a cada 15s
        const syncInterval = setInterval(performInitialSync, 15000);

        function updatePendingCount() {
            const queue = JSON.parse(localStorage.getItem('OFFLINE_SCANS_QUEUE') || '[]');
            setPendingCount(queue.length);
        }

        return () => {
            clearInterval(syncInterval);
            window.removeEventListener('online', performInitialSync);
        };
    }, []);

    // Atualização imediata do contador ao detectar
    useEffect(() => {
        if (isClient) {
            const queue = JSON.parse(localStorage.getItem('OFFLINE_SCANS_QUEUE') || '[]');
            setPendingCount(queue.length);
        }
    }, [scanState.status, isClient]);

    const handleLoginSuccess = (pubKey: string) => {
        setPublicKey(pubKey);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        AuthService.logout();
        setIsLoggedIn(false);
        setPublicKey('');
    };

    // Helper para formatar detalhes
    const renderDetails = () => {
        if (!scanState.details) return null;
        try {
            const data = JSON.parse(scanState.details);
            return (
                <div className="space-y-1">
                    <p className="text-slate-800 font-bold text-lg">{data.nome}</p>
                    <p className="text-slate-500 text-xs">ID Ticket: {data.ticketId}</p>
                </div>
            );
        } catch (e) {
            return <p className="text-slate-700">{scanState.details}</p>;
        }
    };

    if (!isClient) return <div className="min-h-screen bg-white" />;

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-primary-green/20">
            {!isLoggedIn && <LoginOverlay onLoginSuccess={handleLoginSuccess} />}

            <main className="flex-1 flex flex-col items-center p-6 pt-12 relative max-w-lg mx-auto w-full">

            <header className="flex flex-col items-center mb-10">
                <div className="relative w-[180px] h-[90px]">
                    <img
                        src="/scanner/img/logo.jpg"
                        alt="Alta Café Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
            </header>

            {isLoggedIn && (
                <section className="relative w-full max-w-[420px] aspect-square rounded-lg overflow-hidden">
                    <ScannerCamera onDetect={onDetect} isPaused={isPaused} />
                    <StatusOverlay status={scanState.status} />
                    <FlashEffect active={flashActive} />

                    {/* Badge de Sincronização Pendente */}
                    {pendingCount > 0 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white animate-bounce z-50">
                            {pendingCount} SINC. PENDENTE
                        </div>
                    )}
                </section>
            )}

            <footer className="w-full max-w-[400px] mt-6 flex flex-col gap-4">
                <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                    scanState.status === 'SUCCESS' ? 'bg-green-50 border-green-200' :
                    scanState.status === 'ALREADY_SCANNED' ? 'bg-yellow-50 border-yellow-200' :
                    scanState.status === 'ERROR' ? 'bg-red-50 border-red-200' :
                    'bg-slate-50 border-slate-100'
                }`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${
                        scanState.status === 'SUCCESS' ? 'text-green-600' :
                        scanState.status === 'ALREADY_SCANNED' ? 'text-yellow-600' :
                        scanState.status === 'ERROR' ? 'text-red-600' :
                        'text-slate-400'
                    }`}>
                        {scanState.message}
                    </h3>
                    {renderDetails()}
                </div>

                {isPaused && (
                    <button
                        onClick={resetScanner}
                        className={`w-full p-4 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all animate-slide-up ${
                            scanState.status === 'ALREADY_SCANNED' ? 'bg-yellow-500 shadow-yellow-200' : 'bg-primary-green shadow-primary-green/20'
                        }`}
                    >
                        🔄 Próximo Escaneamento
                    </button>
                )}

                {pendingCount > 0 && (
                    <button
                        onClick={async () => {
                            const SyncService = (await import('@/services/SyncService')).default;
                            await SyncService.processQueue();
                            const queue = JSON.parse(localStorage.getItem('OFFLINE_SCANS_QUEUE') || '[]');
                            setPendingCount(queue.length);
                        }}
                        className="w-full p-3 bg-red-100 text-red-700 font-bold rounded-xl border border-red-200 hover:bg-red-200 transition-all flex items-center justify-center gap-2"
                    >
                         🚀 Sincronizar Agora ({pendingCount})
                    </button>
                )}

                    </button>
                )}

                {/* --- SEÇÃO DE TESTE SOLICITADA --- */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-1">Área do Desenvolvedor</p>
                    
                    <button
                        onClick={async () => {
                            const SyncService = (await import('@/services/SyncService')).default;
                            const result = await SyncService.generateTestScans(10);
                            alert(`Teste Concluído!\nLote processado: ${result.processed}\nJá verificados: ${result.alreadyScanned}\nErros: ${result.errors}`);
                            const queue = JSON.parse(localStorage.getItem('OFFLINE_SCANS_QUEUE') || '[]');
                            setPendingCount(queue.length);
                        }}
                        className="w-full p-3 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                    >
                         🧪 Gerar 10 Scans e Sincronizar
                    </button>

                    <button
                        onClick={handleLogout}
                        className="text-slate-400 text-[10px] font-semibold hover:text-red-400 transition-colors uppercase tracking-widest mt-2"
                    >
                        Sair da Conta
                    </button>
                </div>
            </footer>
        </main>
</div>
    );
}
