import FormCadastro from '@/components/FormCadastro';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            {/* For dynamic/actual logo later, replacing with styled text for now */}
            <img src="/pdf-imagens/altacafe.png" alt="Alta Café Logo" className={styles.logoImage} />
            <p className={styles.date}>24 A 26 DE MARÇO DE 2026 | CLUBE DE CAMPO DA FRANCA</p>
            <p className={styles.tagline}>CULTIVANDO CONEXÕES</p>
          </div>
        </header>

        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Credenciamento de Participante</h2>
            <p className={styles.formSubtitle}>Preencha seus dados para garantir acesso ao evento.</p>

            <FormCadastro />
          </div>
        </section>
      </div>
    </main>
  );
}
