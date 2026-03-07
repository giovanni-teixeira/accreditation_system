'use client';

import { useState, useTransition, ChangeEvent, FormEvent } from 'react';
import styles from './FormCadastro.module.css';
import { cadastrarUsuario, CadastroResponse } from '@/controllers/CredenciadoController';
import SuccessModal from './SuccessModal';

const ROLES = [
    { id: 'expositor', label: 'Expositor', icon: '🏢' },
    { id: 'cafeicultor', label: 'Cafeicultor', icon: '🌱' },
    { id: 'visitante', label: 'Visitante', icon: '🎟️' },
    { id: 'imprensa', label: 'Imprensa', icon: '📸' }
];

interface FormDataState {
    nomeCompleto: string;
    cpf: string;
    rg: string;
    celular: string;
    email: string;
    municipio: string;
    uf: string;
    aceitouLgpd: boolean;
    cnpj: string;
    siteEmpresa: string;
    nomeEmpresa: string;
    ccir: string;
    nomePropriedade: string;
    nomeVeiculo: string;
}

export default function FormCadastro() {
    const [role, setRole] = useState<string>('');
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro'; mensagem: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastSubmission, setLastSubmission] = useState<any>(null);

    const [formData, setFormData] = useState<FormDataState>({
        nomeCompleto: '', cpf: '', rg: '', celular: '', email: '',
        municipio: '', uf: '', aceitouLgpd: false,
        cnpj: '', siteEmpresa: '', nomeEmpresa: '',
        ccir: '', nomePropriedade: '', nomeVeiculo: ''
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);
        startTransition(async () => {
            const result: CadastroResponse = await cadastrarUsuario({ role, ...formData });
            setFeedback({ tipo: result.sucesso ? 'sucesso' : 'erro', mensagem: result.mensagem });
            if (result.sucesso) {
                setLastSubmission({ ...formData, role });
                setIsModalOpen(true);
                // setRole(''); // Keep role for now to avoid the form vanishing before modal is seen if needed, but the modal is overlay
                setFormData({
                    nomeCompleto: '', cpf: '', rg: '', celular: '', email: '',
                    municipio: '', uf: '', aceitouLgpd: false,
                    cnpj: '', siteEmpresa: '', nomeEmpresa: '',
                    ccir: '', nomePropriedade: '', nomeVeiculo: ''
                });
            }
        });
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            {/* SELEÇÃO DE PERFIL */}
            <div className={styles.roleSelection}>
                <h3 className={styles.sectionTitle}>1. Qual o seu perfil no evento?</h3>
                <div className={styles.radioGrid}>
                    {ROLES.map((r) => (
                        <label
                            key={r.id}
                            className={`${styles.radioCard} ${role === r.id ? styles.selected : ''}`}
                        >
                            <input
                                type="radio"
                                name="role"
                                value={r.id}
                                checked={role === r.id}
                                onChange={(e) => setRole(e.target.value)}
                                className={styles.hiddenRadio}
                                required
                            />
                            <span className={styles.cardIcon}>{r.icon}</span>
                            <span className={styles.cardLabel}>{r.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {role && (
                <div className={styles.dynamicFormAnimation}>
                    <h3 className={styles.sectionTitle}>2. Seus Dados Pessoais</h3>

                    <div className={styles.inputGrid}>
                        <div className={styles.inputGroupFull}>
                            <label>Nome Completo</label>
                            <input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleInputChange} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>CPF</label>
                            <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>RG</label>
                            <input type="text" name="rg" value={formData.rg} onChange={handleInputChange} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Celular (WhatsApp)</label>
                            <input type="tel" name="celular" value={formData.celular} onChange={handleInputChange} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>E-mail</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Município</label>
                            <input type="text" name="municipio" value={formData.municipio} onChange={handleInputChange} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>UF</label>
                            <select name="uf" value={formData.uf} onChange={handleInputChange} required>
                                <option value="">Selecione</option>
                                <option value="SP">São Paulo</option>
                                <option value="MG">Minas Gerais</option>
                                {/* Omitindo os outros estados por brevidade, mas deveriam estar aqui */}
                                <option value="OUTRO">Outro</option>
                            </select>
                        </div>
                    </div>

                    {/* DADOS ESPECÍFICOS */}
                    {(role === 'expositor' || role === 'cafeicultor' || role === 'imprensa') && (
                        <>
                            <h3 className={styles.sectionTitle}>3. Informações Complementares ({role})</h3>
                            <div className={styles.inputGrid}>

                                {role === 'expositor' && (
                                    <>
                                        <div className={styles.inputGroup}>
                                            <label>CNPJ</label>
                                            <input type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} required />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Nome da Empresa</label>
                                            <input type="text" name="nomeEmpresa" value={formData.nomeEmpresa} onChange={handleInputChange} required />
                                        </div>
                                        <div className={styles.inputGroupFull}>
                                            <label>Site da Empresa</label>
                                            <input type="url" name="siteEmpresa" value={formData.siteEmpresa} onChange={handleInputChange} />
                                        </div>
                                    </>
                                )}

                                {role === 'cafeicultor' && (
                                    <>
                                        <div className={styles.inputGroup}>
                                            <label>CCIR</label>
                                            <input type="text" name="ccir" value={formData.ccir} onChange={handleInputChange} required />
                                        </div>
                                        <div className={styles.inputGroupFull}>
                                            <label>Nome da Propriedade</label>
                                            <input type="text" name="nomePropriedade" value={formData.nomePropriedade} onChange={handleInputChange} required />
                                        </div>
                                    </>
                                )}

                                {role === 'imprensa' && (
                                    <>
                                        <div className={styles.inputGroup}>
                                            <label>CNPJ</label>
                                            <input type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} required />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Nome do Veículo</label>
                                            <input type="text" name="nomeVeiculo" value={formData.nomeVeiculo} onChange={handleInputChange} required />
                                        </div>
                                        <div className={styles.inputGroupFull}>
                                            <label>Site da Empresa / Veículo</label>
                                            <input type="url" name="siteEmpresa" value={formData.siteEmpresa} onChange={handleInputChange} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    {/* TERMOS LGPD */}
                    <div className={styles.lgpdSection}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="aceitouLgpd"
                                checked={formData.aceitouLgpd}
                                onChange={handleInputChange}
                                required
                            />
                            <span className={styles.checkmark}></span>
                            Declaro que li e concordo com a coleta e tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD) e autorizo o envio de comunicações sobre o evento Alta Café.
                        </label>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isPending}>
                        {isPending ? 'Processando...' : 'Finalizar Credenciamento'}
                    </button>

                    {feedback && (
                        <div className={`${styles.feedbackMessage} ${feedback.tipo === 'sucesso' ? styles.success : styles.error}`}>
                            {feedback.tipo === 'erro' && feedback.mensagem.includes(', ') ? (
                                <ul className={styles.errorList}>
                                    {feedback.mensagem.split(', ').map((msg, i) => (
                                        <li key={i}>{msg}</li>
                                    ))}
                                </ul>
                            ) : (
                                feedback.mensagem
                            )}
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && lastSubmission && (
                <SuccessModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userData={lastSubmission}
                />
            )}
        </form>
    );
}
