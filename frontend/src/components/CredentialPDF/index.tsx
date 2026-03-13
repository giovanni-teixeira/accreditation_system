'use client';

import React, { forwardRef } from 'react';
import styles from './style.module.css';

interface CredentialPDFProps {
    userData: any;
    corTipo: string;
}

const CredentialPDF = forwardRef<HTMLDivElement, CredentialPDFProps>(({ userData, corTipo }, ref) => {
    // Prioriza o QR Code em Base64 (pré-carregado) para o PDF
    const qrSource = (userData as any).qrBase64 || `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(userData.qrToken)}&format=png&qzone=1`;

    return (
        <div id="credencial" ref={ref} className={styles.folhaA4} style={{ '--cor-tipo': corTipo } as any}>
            {/* QUADRANTE 1 */}
            <div className={styles.quadrante}>
                <div className={styles.logoEventoContainer}>
                    <img src="/imagens/6 alta café.png" className={styles.logoEvento} alt="Logo Evento" crossOrigin="anonymous" />
                </div>

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
                    <img src={qrSource} className={styles.qrCode} alt="QR Code" crossOrigin="anonymous" />
                </div>

                <div className={styles.faixaTipo}>
                    {userData.role?.toUpperCase() === 'CAFEICULTOR' ? 'PRODUTOR' : userData.role}
                </div>
            </div>

            {/* QUADRANTE 2 */}
            <div className={styles.quadrante}>
                <div className={styles.logoEventoContainer}>
                    <img src="/imagens/6 alta café.png" className={styles.logoEvento} alt="Logo Evento" crossOrigin="anonymous" />
                </div>

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
                    <img src={qrSource} className={styles.qrCode} alt="QR Code" crossOrigin="anonymous" />
                </div>

                <div className={styles.faixaTipo}>
                    {userData.role?.toUpperCase() === 'CAFEICULTOR' ? 'PRODUTOR' : userData.role}
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

                <div className={styles.tituloRegras}>ESTA É SUA CREDENCIAL</div>

                <p>
                    • Leve sua credencial impressa ao evento<br />
                    • Dobre em 4<br />
                    • Apresente no portão a sua credencial
                </p>

                <div className={styles.tituloRegras}>CREDENCIAL PESSOAL E INTRANSFERÍVEL</div>

                <p>
                    • Uso obrigatório durante todo o evento. <br />
                    • O portador concorda com o uso de sua imagem (fotos e vídeos) para divulgação do evento.
                </p>
            </div>

            {/* QUADRANTE 4 */}
            <div className={`${styles.quadrante} ${styles.q4}`}>
                <div className={styles.tituloSecao}>APOIO DE MÍDIA</div>
                <div className={styles.gridLogos}>
                    <img src="/imagens/EPTV.png" alt="EPTV" />
                    <img src="/imagens/epagro.png" alt="Epagro" />
                    <img src="/imagens/Attalea.png" alt="Attalea" />
                </div>

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
    );
});

CredentialPDF.displayName = 'CredentialPDF';

export default CredentialPDF;
