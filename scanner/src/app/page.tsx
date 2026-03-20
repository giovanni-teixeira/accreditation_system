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

        // Tenta sincronizar scans offline a cada 30 segundos
        const syncInterval = setInterval(async () => {
            const { default: SyncService } = await import('@/services/SyncService');
            SyncService.processQueue();
            
            // Atualiza contador de pendentes
            const queueStr = localStorage.getItem('OFFLINE_SCANS_QUEUE');
            if (queueStr) {
                try {
                    const queue = JSON.parse(queueStr);
                    setPendingCount(queue.length);
                } catch (e) { setPendingCount(0); }
            } else {
                setPendingCount(0);
            }
        }, 30000);

        return () => clearInterval(syncInterval);
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
                    
                    {/* Badge de Sincronização Pendente (Comentado conforme solicitação)
                    {pendingCount > 0 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white animate-bounce z-50">
                            {pendingCount} SINC. PENDENTE
                        </div>
                    )}
                    */}
                </section>
            )}

            <footer className="w-full max-w-[400px] mt-6 flex flex-col gap-4">
                <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                    scanState.status === 'SUCCESS' || scanState.status === 'ALREADY_SCANNED' ? 'bg-green-50 border-green-200' :
                    scanState.status === 'ERROR' ? 'bg-red-50 border-red-200' :
                    'bg-slate-50 border-slate-100'
                }`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${
                        scanState.status === 'SUCCESS' || scanState.status === 'ALREADY_SCANNED' ? 'text-green-600' :
                        scanState.status === 'ERROR' ? 'text-red-600' :
                        'text-slate-400'
                    }`}>
                        {/* A lógica de status "Já Verificado Hoje" foi removida conforme pedido, exibindo sempre sucesso */}
                        {scanState.status === 'ALREADY_SCANNED' ? 'Acesso Liberado!' : scanState.message}
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

                <button
                    onClick={handleLogout}
                    className="text-slate-400 text-xs font-semibold hover:text-red-400 transition-colors uppercase tracking-widest mt-2"
                >
                    Sair da Conta
                </button>
            </footer>
            </main>
        </div>
    );
}
