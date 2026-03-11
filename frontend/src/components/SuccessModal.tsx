import { useRef } from 'react';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        nomeCompleto: string;
        cidade: string;
        estado: string;
        nomeEmpresa?: string;
        role: string;
        email: string;
        qrToken: string;
    };
}

export default function SuccessModal({ isOpen, onClose, userData }: SuccessModalProps) {
    const templateRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleDownloadPDF = async () => {
        const html2pdf = (await import('html2pdf.js' as any)).default;
        const element = templateRef.current;

        if (!element) return;

        const opt = {
            margin: 0,
            filename: `credencial-${userData.nomeCompleto.replace(/\s+/g, '-').toLowerCase()}.pdf`,
            image: { type: 'jpeg' as const, quality: 1 },
            html2canvas: { scale: 3, useCORS: true },
            jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };

        html2pdf().set(opt).from(element).save();
    };

    const getFaixaColor = (role: string) => {
        const r = role.toLowerCase();
        if (r.includes("visitante")) return "#007bff";
        if (r.includes("expositor")) return "#28a745";
        if (r.includes("cafeicultor")) return "#5D4037"; // Marrom
        if (r.includes("imprensa")) return "#6f42c1"; // Roxo
        if (r.includes("staff")) return "#fd7e14";
        return "#007bff"; // default
    };

    const corTipo = getFaixaColor(userData.role);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(userData.qrToken)}`;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>🎉 Credenciamento Realizado!</h2>
                    <p>Seu PDF foi enviado para o e-mail: <strong>{userData.email}</strong></p>
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
                    <div id="credencial" ref={templateRef} className={styles.folhaA4} style={{ '--cor-tipo': corTipo } as any}>

                        {/* QUADRANTE 1 */}
                        <div className={styles.quadrante}>
                            <img src="/imagens/6 alta café.png" className={styles.logoEvento} alt="Logo Evento" />
                            <div className={styles.nomeUsuario}>{userData.nomeCompleto}</div>
                            <div className={styles.cidadeEmpresa}>
                                {userData.cidade} - {userData.estado}
                                {userData.nomeEmpresa && (
                                    <>
                                        <br />
                                        <strong>{userData.nomeEmpresa}</strong>
                                    </>
                                )}
                            </div>
                            <div className={styles.qrContainer}>
                                <img src={qrUrl} className={styles.qrCode} alt="QR Code" />
                            </div>
                            <div className={styles.faixaTipo}>
                                {userData.role}
                            </div>
                        </div>

                        {/* QUADRANTE 2 */}
                        <div className={styles.quadrante}>
                            <img src="/imagens/6 alta café.png" className={styles.logoEvento} alt="Logo Evento" />
                            <div className={styles.nomeUsuario}>{userData.nomeCompleto}</div>
                            <div className={styles.cidadeEmpresa}>
                                {userData.cidade} - {userData.estado} <br />
                                <strong>{userData.nomeEmpresa || '----'}</strong>
                            </div>
                            <div className={styles.qrContainer}>
                                <img src={qrUrl} className={styles.qrCode} alt="QR Code" />
                            </div>
                            <div className={styles.faixaTipo}>
                                {userData.role}
                            </div>
                        </div>

                        {/* QUADRANTE 3 */}
                        <div className={styles.quadrante}>
                            <div className={styles.labelEvento}>EVENTO</div>
                            <div className={styles.valorEvento}>6ª ALTA CAFÉ</div>

                            <div className={styles.labelEvento}>LOCAL</div>
                            <div className={styles.valorEvento}>CLUBE DE CAMPO DE FRANCA</div>

                            <div className={styles.labelEvento}>DATA INICIAL</div>
                            <div className={styles.valorEvento}>24/03/2026</div>

                            <div className={styles.labelEvento}>DATA FINAL</div>
                            <div className={styles.valorEvento}>26/03/2026</div>

                            <div className={styles.tituloSecao}>APOIO DE MÍDIA</div>
                            <div className={styles.gridLogos}>
                                <img src="/imagens/EPTV.png" alt="EPTV" />
                                <img src="/imagens/epagro.png" alt="Epagro" />
                                <img src="/imagens/Attalea.png" alt="Attalea" />
                            </div>
                        </div>

                        {/* QUADRANTE 4 */}
                        <div className={`${styles.quadrante} ${styles.q4}`}>
                            <div className={styles.tituloRegras}>ESTA É SUA CREDENCIAL</div>

                            <p>
                                • Leve sua credencial impressa ao evento<br />
                                • Dobre em 4<br />
                                • Apresente no portão a sua credencial
                            </p>

                            <p>
                                <strong>CREDENCIAL PESSOAL E INTRANSFERÍVEL</strong><br />
                                • Uso obrigatório durante todo o evento. <br />
                                • O portador concorda com o uso de sua imagem (fotos e vídeos) para divulgação do evento.
                            </p>

                            <div className={styles.tituloSecao}>PATROCINADORES</div>
                            <div className={styles.gridLogos}>
                                <img src="/imagens/altacafe.png" alt="Alta Cafe" />
                                <img src="/imagens/aeagro.png" alt="AEAgro" />
                                <img src="/imagens/Sindicato Rural.png" alt="Sindicato Rural" />
                                <img src="/imagens/Sami.png" alt="Sami" />
                                <img src="/imagens/AgroPL.png" alt="Agro PL" />
                                <img src="/imagens/Guapuã.png" alt="Guapua" />
                                <img src="/imagens/OIMASA.png" alt="OIMASA" />
                                <img src="/imagens/Olimáquinas.png" alt="Olimaquinas" />
                                <img src="/imagens/Robusta.png" alt="Robusta" />
                                <img src="/imagens/AAlves.png" alt="AAlves" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
