'use client';

import { useState, useCallback } from 'react';
import { ScannerService, ScanResult } from '@/services/ScannerService';
import SyncService from '@/services/SyncService';

export function useScanner(publicKey: string) {
    const [scanState, setScanState] = useState<{
        status: 'IDLE' | 'SUCCESS' | 'ERROR' | 'ALREADY_SCANNED';
        message: string;
        details?: string;
    }>({ status: 'IDLE', message: 'Aguardando Leitura...' });

    const [isPaused, setIsPaused] = useState(false);
    const [flashActive, setFlashActive] = useState(false);

    const onDetect = useCallback((decodedText: string) => {
        try {
            if (!publicKey) return;

            setFlashActive(true);
            setTimeout(() => setFlashActive(false), 300);

            const result = ScannerService.validateScan(decodedText, publicKey);

            if (result.isValid && result.data) {
                const ticketId = result.data.ticketId;


                if (SyncService.isAlreadyScannedToday(ticketId)) {
                    setScanState({
                        status: 'ALREADY_SCANNED',
                        message: 'Já Verificado Hoje',
                        details: JSON.stringify(result.data)
                    });
                } else {

                    SyncService.enqueueScan(ticketId);
                    setScanState({
                        status: 'SUCCESS',
                        message: 'Acesso Liberado!',
                        details: JSON.stringify(result.data)
                    });
                }
                setIsPaused(true);
            } else {
                setScanState({
                    status: 'ERROR',
                    message: 'Falha na Validação',
                    details: result.error
                });
                setIsPaused(true);
            }
        } catch (err: any) {
            console.error('Erro inesperado no hook de scan:', err);
            setScanState({
                status: 'ERROR',
                message: 'Erro Interno no App',
                details: 'Por favor, reinicie o scanner.'
            });
            setIsPaused(true);
        }
    }, [publicKey]);

    const resetScanner = () => {
        setScanState({ status: 'IDLE', message: 'Aguardando Leitura...' });
        setIsPaused(false);
    };

    return {
        scanState,
        isPaused,
        flashActive,
        onDetect,
        resetScanner
    };
}
