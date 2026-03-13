'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './style.module.css';
import CredentialPDF from '../CredentialPDF';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        nomeCompleto: string;
        cidade: string;
        estado: string;
        nomeEmpresa?: string;
        role: string;
        qrToken: string;
    };
}

const SuccessModal = ({ isOpen, onClose, userData }: SuccessModalProps) => {
    const templateRef = useRef<HTMLDivElement>(null);
    const [qrBase64, setQrBase64] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            // Pré-carrega o QR Code como SVG para máxima qualidade no PDF
            if (userData.qrToken) {
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(userData.qrToken)}&format=svg&qzone=1&ecc=M`;
                fetch(qrUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        const reader = new FileReader();
                        reader.onloadend = () => setQrBase64(reader.result as string);
                        reader.readAsDataURL(blob);
                    })
                    .catch(err => console.error("Erro ao pré-carregar QR Code:", err));
            }
        } else {
            document.body.style.overflow = 'auto';
            setQrBase64(null);
        }
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen, userData.qrToken]);

    if (!isOpen) return null;

    const handleDownloadPDF = async () => {
        if (!templateRef.current) return;

        // Pequeno delay para garantir que o QR Code externo carregue completamente
        await new Promise(resolve => setTimeout(resolve, 800));

        // Import dinâmico para evitar erros de SSR ou problemas de carregamento
        // @ts-ignore
        const html2pdf = (await import('html2pdf.js')).default;

        const opt = {
            margin: 0,
            filename: `credencial_${userData.nomeCompleto.replace(/\s+/g, '_').toLowerCase()}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: {
                scale: 3,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: false
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
        } as any;

        html2pdf().from(templateRef.current).set(opt).save();
    };

    const getFaixaColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'visitante': return '#8B008B';  // Roxo
            case 'expositor': return '#0000FF';  // Azul
            case 'imprensa': return '#778899';   // Cinza
            case 'produtor':
            case 'cafeicultor': return '#00FF00'; // Verde Limão
            case 'comissao':
            case 'organizacao': return '#FF0000'; // Vermelho
            case 'terceiro':
            case 'terceirizado': return '#FFFF00'; // Amarelo
            default: return '#00FF00';
        }
    };

    const corTipo = getFaixaColor(userData.role);

    // Usamos Portal para garantir que o modal fique na raiz do body, 
    // evitando conflitos de posicionamento com elementos pai.
    return createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>🎉 Credenciamento Realizado!</h2>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.alertBox}>
                        <strong>Lembrete importante:</strong>
                        <p>Imprima sua credencial para evitar espera na fila na porta do evento.</p>
                    </div>

                    <div className={styles.actions}>
                        <button onClick={handleDownloadPDF} className={styles.downloadBtn}>
                            Baixar Credencial (PDF)
                        </button>
                        <button onClick={onClose} className={styles.closeBtn}>
                            Fechar
                        </button>
                    </div>
                </div>

                {/* 1:1 REPLICA FROM index.html HIDDEN FOR EXPORT */}
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', overflow: 'hidden' }}>
                    <CredentialPDF
                        ref={templateRef}
                        userData={{ ...userData, qrBase64 }}
                        corTipo={corTipo}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};

SuccessModal.displayName = 'SuccessModal';

export default SuccessModal;
