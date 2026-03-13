import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './style.module.css';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    messages: string | string[];
}

export default function ErrorModal({ isOpen, onClose, messages }: ErrorModalProps) {

    // Bloqueia o scroll do fundo da página quando o modal abre
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Fecha o modal ao pressionar ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !messages) return null;

    const isArray = Array.isArray(messages) && messages.length > 0;
    const isSingleStringWithCommas = typeof messages === 'string' && messages.includes(',');

    let errorItems: string[] = [];

    if (isArray) {
        errorItems = messages as string[];
    } else if (isSingleStringWithCommas) {
        // Sepeara as validações que o backend envia concatenadas
        errorItems = (messages as string).split(', ');
    }

    // Usamos Portal para garantir que o modal fique na raiz do body, 
    // evitando que transforms nos pais (como animações de entrada) desloquem o modal.
    return createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>

                <div className={styles.modalHeader}>
                    <div className={styles.errorIcon}>
                        <span>!</span>
                    </div>
                    <h2>Ooops! Falha no Cadastro</h2>
                </div>

                <div className={styles.modalBody}>
                    {errorItems.length > 0 ? (
                        <ul className={styles.errorList}>
                            {errorItems.map((msg, i) => (
                                <li key={i}>{msg}</li>
                            ))}
                        </ul>
                    ) : (
                        <div className={styles.singleMessage}>
                            {messages}
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.closeBtn}>
                        Voltar e Corrigir
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
