'use client';

import React from 'react';

interface StatusOverlayProps {
    status: 'SUCCESS' | 'ERROR' | 'IDLE' | 'ALREADY_SCANNED';
}

export const StatusOverlay: React.FC<StatusOverlayProps> = ({ status }) => {
    if (status === 'IDLE') return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 z-40 rounded-[18px] animate-fade-in">
            {status === 'SUCCESS' && (
                <svg className="w-[110px] h-[110px]" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="45"
                        className="fill-none stroke-primary-green stroke-[5] [stroke-dasharray:283] [stroke-dashoffset:283] animate-draw-circle"
                        style={{ strokeLinecap: 'round', transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                    />
                    <polyline
                        points="28,52 42,66 72,36"
                        className="fill-none stroke-primary-green stroke-[5] [stroke-dasharray:80] [stroke-dashoffset:80] animate-draw-check"
                        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                    />
                </svg>
            )}

            {/*
            {status === 'ALREADY_SCANNED' && (



                <div className="flex flex-col items-center gap-3">
                    <div className="text-yellow-400 text-7xl animate-pulse">⚠️</div>
                </div>
                )}
            */}

            {status === 'ERROR' && (
                <div className="text-white text-6xl animate-bounce">❌</div>
            )}
        </div>
    );
};

export const FlashEffect: React.FC<{ active: boolean }> = ({ active }) => (
    <div className={`absolute inset-0 bg-primary-green/35 pointer-events-none z-30 transition-opacity duration-150 ${active ? 'opacity-100' : 'opacity-0'}`} />
);
