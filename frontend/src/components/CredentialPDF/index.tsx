'use client';

import React, { forwardRef } from 'react';
import styles from './style.module.css';

interface CredentialPDFProps {
    userData: any;
    corTipo: string;
}

const CredentialPDF = forwardRef<HTMLDivElement, CredentialPDFProps>(({ userData, corTipo }, ref) => {
    // Prioriza o QR Code em Base64 (pré-carregado) para o PDF
    const qrSource = (userData as any).qrBase64 || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&ecc=L&data=${encodeURIComponent(userData.qrToken)}&format=png&qzone=1`;


    const SHOW_FIELDS = {
        imprensa: true,
        expositor: true,
        produtor: true,
    };

    const getExtraInfo = () => {
        const role = userData.role?.toLowerCase();
        if (!SHOW_FIELDS[role as keyof typeof SHOW_FIELDS]) return null;

        if (role === 'imprensa') return userData.nomeVeiculo;
        if (role === 'expositor') return userData.nomeEmpresa;
        if (role === 'produtor' ) return userData.nomePropriedade;
        return null;
    };

    const extraInfo = getExtraInfo();

    return (
        <div id="credencial" ref={ref} className={styles.folhaA4} style={{ '--cor-tipo': corTipo } as any}>
            {/* QUADRANTE 1 */}
            <div className={styles.quadrante}>
                <div className={styles.logoEventoContainer}>
                    <img src="/imagens/6 alta café.png" className={styles.logoEvento} alt="Logo Evento" crossOrigin="anonymous" />
                </div>

                <div className={styles.nomeUsuario}>{userData.nomeCompleto}</div>

                <div className={styles.cidadeUF}>
                    {userData.cidade} - {userData.estado}
                </div>

                {extraInfo && (
                    <div className={styles.infoAdicional}>
                        <strong>{extraInfo}</strong>
                    </div>
                )}

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

                <div className={styles.cidadeUF}>
                    {userData.cidade} - {userData.estado}
                </div>

                {extraInfo && (
                    <div className={styles.infoAdicional}>
                        <strong>{extraInfo}</strong>
                    </div>
                )}

                <div className={styles.qrContainer}>
                    <img src={qrSource} className={styles.qrCode} alt="QR Code" crossOrigin="anonymous" />
                </div>

                <div className={styles.faixaTipo}>
                    {userData.role?.toUpperCase() === 'CAFEICULTOR' ? 'PRODUTOR'  : userData.role}
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
                <div className={styles.tituloSecao}>PATROCÍNIO</div>
                <div className={`${styles.gridLogos} ${styles.patrocinio}`}>
                    <img src="/imagens/Jacto.png" alt="Jacto" crossOrigin="anonymous" />
                </div>

                <div className={styles.tituloSecao}>ORGANIZAÇÃO E REALIZAÇÃO</div>
                <div className={styles.gridLogos}>
                    <img src="/imagens/AAlves.png" alt="AAlves" crossOrigin="anonymous" />
                    <img src="/imagens/AgroPL.png" alt="AgroPL" crossOrigin="anonymous" />
                    <img src="/imagens/OIMASA.png" alt="OIMASA" crossOrigin="anonymous" />
                    <img src="/imagens/Olimáquinas.png" alt="Olimáquinas" crossOrigin="anonymous" />
                    <img src="/imagens/Robusta.png" alt="Robusta" crossOrigin="anonymous" />
                    <img src="/imagens/Sami.png" alt="Sami" crossOrigin="anonymous" />
                    <img src="/imagens/Sindicato Rural.png" alt="Sindicato Rural" crossOrigin="anonymous" />
                    <img src="/imagens/aeagro.png" alt="aeagro" crossOrigin="anonymous" />
                </div>

                <div className={styles.tituloSecao}>APOIO</div>
                <div className={`${styles.gridLogos} ${styles.apoio}`}>
                    <img src="/imagens/FAESP.png" alt="FAESP" crossOrigin="anonymous" />
                    <img src="/imagens/sebrae.png" alt="sebrae" crossOrigin="anonymous" />
                    <img src="/imagens/OCB.png" alt="OCB" crossOrigin="anonymous" />
                </div>

                <div className={styles.tituloSecao}>APOIO DE MÍDIA</div>
                <div className={`${styles.gridLogos} ${styles.midia}`}>
                    <img src="/imagens/EPTV.png" alt="EPTV" crossOrigin="anonymous" />
                    <img src="/imagens/epagro.png" alt="epagro" crossOrigin="anonymous" />
                    <img src="/imagens/Attalea.png" alt="Attalea" crossOrigin="anonymous" />
                </div>
            </div>
        </div>
    );
});

CredentialPDF.displayName = 'CredentialPDF';

export default CredentialPDF;
