'use client';

import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './StatusModal.module.css';
import CredentialPDF from '../../CredentialPDF';

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    messages?: string | string[];
    userData?: {
        nomeCompleto: string;
        cidade: string;
        estado: string;
        nomeEmpresa?: string;
        role: string;
        qrToken: string;
    };
}

export function StatusModal({ isOpen, onClose, type, messages, userData }: StatusModalProps) {
    const templateRef = useRef<HTMLDivElement>(null);
    const [qrBase64, setQrBase64] = useState<string | null>(null);

    const isSuccess = type === 'success';

    // Bloqueia o scroll do fundo da página quando o modal abre baseada no feedback do usuário.
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Fecha o modal ao pressionar ESC baseada no feedback do usuário.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Preparação do QR Code para o PDF baseada no feedback do usuário.
    useEffect(() => {
        if (isOpen && isSuccess && userData?.qrToken) {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(userData.qrToken)}&format=svg&qzone=1&ecc=L`;
            fetch(qrUrl)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => setQrBase64(reader.result as string);
                    reader.readAsDataURL(blob);
                })
                .catch(err => console.error("Erro ao pré-carregar QR Code:", err));
        }
    }, [isOpen, isSuccess, userData?.qrToken]);

    if (!isOpen) return null;

    const handleDownloadPDF = async () => {
        if (!templateRef.current || !userData) return;
        const html2pdf = (await import('html2pdf.js')).default;
        const opt = {
            margin: 0,
            filename: `credencial_${userData.nomeCompleto.replace(/\s+/g, '_').toLowerCase()}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 3, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        } as any;
        html2pdf().from(templateRef.current).set(opt).save();
    };

    const getFaixaColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'visitante': return '#8B008B';
            case 'expositor': return '#0000FF';
            case 'imprensa': return '#778899';
            case 'produtor':
            case 'cafeicultor': return '#00FF00';
            default: return '#00FF00';
        }
    };

    const errorItems = Array.isArray(messages) ? messages : (typeof messages === 'string' ? messages.split(', ') : []);

    return createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.statusModalContent} ${isSuccess ? styles.contentSuccess : styles.contentError}`} onClick={e => e.stopPropagation()}>
                
                <div className={`${styles.statusHeader} ${isSuccess ? styles.headerSuccess : styles.headerError}`}>
                    <div className={`${styles.statusIcon} ${isSuccess ? styles.iconSuccess : styles.iconError}`}>
                        {isSuccess ? '🎉' : '!'}
                    </div>
                    <h2 className={isSuccess ? styles.titleSuccess : styles.titleError}>
                        {isSuccess ? 'Credenciamento Realizado!' : 'Ooops! Falha no Cadastro'}
                    </h2>
                </div>

                <div className={styles.statusBody}>
                    {isSuccess ? (
                        <>
                            <div className={styles.yellowBanner}>
                                <strong>Lembrete importante:</strong>
                                Imprima sua credencial para evitar espera na fila na porta do evento. baseada no feedback do usuário.
                            </div>
                            <div className={styles.modalActions}>
                                <button onClick={handleDownloadPDF} className={`${styles.btnPrimaryAction} ${styles.btnSuccessAction}`}>
                                    Baixar Credencial (PDF)
                                </button>
                                <button onClick={onClose} className={styles.btnSecondaryAction}>
                                    Fechar
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.errorList}>
                                {errorItems.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                                        {errorItems.map((msg, i) => <li key={i}>{msg}</li>)}
                                    </ul>
                                ) : (
                                    <p style={{ margin: 0 }}>{messages || 'Erro desconhecido.'}</p>
                                )}
                            </div>
                            <div className={styles.modalActions}>
                                <button onClick={onClose} className={`${styles.btnPrimaryAction} ${styles.btnErrorAction}`}>
                                    Voltar e Corrigir
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Template invisível para PDF baseada no feedback do usuário. */}
                {isSuccess && userData && (
                    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                        <CredentialPDF
                            ref={templateRef}
                            userData={{ ...userData, qrBase64 }}
                            corTipo={getFaixaColor(userData.role)}
                        />
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
