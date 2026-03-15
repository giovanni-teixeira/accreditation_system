'use client';

import { useState } from 'react';
import FormCadastro from '@/features/registration-form/FormCadastro';
import SearchCPF from '@/components/SearchCPF';
import { StatusModal } from '@/components/ui/StatusModal';
import { CadastroResponse } from '@/controllers/CredenciadoController';
import styles from './page.module.css';

export default function Home() {
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [modalOpen, setModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleResult = (result: CadastroResponse) => {
    if (result.sucesso) {
      setSuccessData(result.dadosRecebidos);
      setModalType('success');
      setModalOpen(true);
    } else {
      setErrorMsg(result.mensagem);
      setModalType('error');
      setModalOpen(true);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <img src="/pdf-imagens/altacafe.png" alt="Alta Café Logo" className={styles.logoImage} />
            <p className={styles.date}>24 A 26 DE MARÇO DE 2026 | CLUBE DE CAMPO DA FRANCA</p>
            <p className={styles.tagline}>CULTIVANDO CONEXÕES</p>

            {/* BUSCA POR CPF COM DESIGN PREMIUM */}
            <SearchCPF onSearchResult={handleResult} />
          </div>
        </header>

        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Credenciamento de Participante</h2>
            <p className={styles.formSubtitle}>Preencha seus dados para garantir acesso ao evento.</p>

            <FormCadastro onResult={handleResult} isBlocked={modalOpen} />
          </div>
        </section>
      </div>

      <StatusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        messages={errorMsg}
        userData={successData ? {
          ...successData,
          nomeCompleto: successData.nomeCompleto || successData.nome,
          cidade: successData.cidade || successData.endereco?.cidade,
          estado: successData.estado || successData.endereco?.estado,
          nomeEmpresa: successData.nomeEmpresa,
          qrToken: successData.credencial?.qrToken || successData.qrToken,
          role: successData.role || successData.tipoCategoria?.toLowerCase()
        } : undefined}
      />
    </main>
  );
}
