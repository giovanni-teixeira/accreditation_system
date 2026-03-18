'use client';

import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface ScannerCameraProps {
    onDetect: (text: string) => void;
    isPaused: boolean;
}

export const ScannerCamera: React.FC<ScannerCameraProps> = ({ onDetect, isPaused }) => {
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const lastScanRef = useRef<number>(0);

    useEffect(() => {

        if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode("qr-reader");
        }

        const startScanner = async () => {
            if (isPaused) return;

            try {
                const qrCodeSuccessCallback = (decodedText: string) => {
                    if (Date.now() - lastScanRef.current < 2000) return;
                    lastScanRef.current = Date.now();
                    onDetect(decodedText);
                };

                const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
                    const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                    const qrboxSize = Math.floor(minEdge * 0.75);
                    return {
                        width: qrboxSize,
                        height: qrboxSize
                    };
                };

                await html5QrCodeRef.current?.start(
                    { facingMode: "environment" },
                    {
                        fps: 20,
                        qrbox: qrboxFunction,
                    },
                    qrCodeSuccessCallback,
                    () => {}
                );
            } catch (err) {
                console.error("Erro ao iniciar scanner:", err);
            }
        };

        const stopScanner = async () => {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                try {
                    await html5QrCodeRef.current.stop();
                } catch (err) {
                    console.error("Erro ao parar scanner:", err);
                }
            }
        };

        if (!isPaused) {
            startScanner();
        } else {
            stopScanner();
        }

        return () => {
            stopScanner();
        };
    }, [isPaused, onDetect]);

    return (
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black shadow-inner border-none focus:outline-none">
            {/* Onde o vídeo será renderizado */}
            <div id="qr-reader" className="w-full h-full [&_video]:object-cover border-none"></div>

            {/* Camada de Gradiente (Vignette) suave */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.6)_100%)] pointer-events-none z-10" />

            {/* Frame de Escaneamento (Corners) - Mais alinhado e fino */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] aspect-square pointer-events-none z-20">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-[3px] border-l-[3px] border-[#2ecc71] rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-[#2ecc71] rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[3px] border-l-[3px] border-[#2ecc71] rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-[#2ecc71] rounded-br-lg" />

                {/* Linha de Scan Animada - Neon Green */}
                {!isPaused && (
                    <div className="absolute left-1 right-1 h-[2px] bg-[#2ecc71] shadow-[0_0_15px_#2ecc71] opacity-70 animate-scan-move" />
                )}
            </div>

            {/* Badge de Status Inferior */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center z-30">
                <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                    <span className="text-white/90 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {isPaused ? 'Leitura Pausada' : 'Aguardando Código'}
                    </span>
                </div>
            </div>
        </div>
    );
};
