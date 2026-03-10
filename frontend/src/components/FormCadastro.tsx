'use client';

import { useState, useTransition, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
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
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    tipoCombustivel: string;
    aceiteLgpd: boolean;
    cnpj: string;
    siteEmpresa: string;
    nomeEmpresa: string;
    ccir: string;
    nomePropriedade: string;
    nomeVeiculo: string;
}

export default function FormCadastro() {
    const [role, setRole] = useState<string>('');
    const formStartRef = useRef<HTMLDivElement>(null);
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro'; mensagem: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastSubmission, setLastSubmission] = useState<any>(null);
    const [cepLocked, setCepLocked] = useState({ rua: false, bairro: false, cidade: false, estado: false });

    const [formData, setFormData] = useState<FormDataState>({
        nomeCompleto: '', cpf: '', rg: '', celular: '', email: '',
        cep: '', rua: '', bairro: '', cidade: '', estado: '',
        tipoCombustivel: 'NAO_INFORMADO', aceiteLgpd: false,
        cnpj: '', siteEmpresa: '', nomeEmpresa: '',
        ccir: '', nomePropriedade: '', nomeVeiculo: ''
    });

    // Refs para as seções para scroll inteligente
    const perfisRef = useRef<HTMLDivElement>(null);
    const dadosPessoaisRef = useRef<HTMLDivElement>(null);
    const dadosEspecificosRef = useRef<HTMLDivElement>(null);
    const lgpdRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);

    // Primeiro campo de cada seção para auto-foco
    const nomeInputRef = useRef<HTMLInputElement>(null);
    const cnpjInputRef = useRef<HTMLInputElement>(null);
    const ccirInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (role && dadosPessoaisRef.current) {
            dadosPessoaisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => nomeInputRef.current?.focus(), 500);
        }
    }, [role]);

    // Função para auxiliar scroll quando campos chave são preenchidos
    const checkProgress = (name: string, value: string) => {
        // Se preencheu email (último campo dos pessoais), rola para os específicos se existirem, senão LGPD
        if (name === 'email' && value.includes('@') && value.includes('.')) {
            if (role === 'visitante') {
                lgpdRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                dadosEspecificosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    cnpjInputRef.current?.focus();
                    ccirInputRef.current?.focus();
                }, 500);
            }
        }
    };

    const fetchViaCep = async (cepText: string) => {
        const zipCode = cepText.replace(/\D/g, '');
        if (zipCode.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        rua: data.logradouro || prev.rua,
                        bairro: data.bairro || prev.bairro,
                        cidade: data.localidade || prev.cidade,
                        estado: data.uf || prev.estado
                    }));
                    setCepLocked({
                        rua: !!data.logradouro,
                        bairro: !!data.bairro,
                        cidade: !!data.localidade,
                        estado: !!data.uf
                    });
                } else {
                    setCepLocked({ rua: false, bairro: false, cidade: false, estado: false });
                }
            } catch (err) {
                console.error('Erro ao buscar CEP:', err);
                setCepLocked({ rua: false, bairro: false, cidade: false, estado: false });
            }
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        let finalValue = value;
        // Aplica máscara de CEP (00000-000)
        if (name === 'cep') {
            finalValue = finalValue.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : finalValue
        }));

        if (name === 'cep' && finalValue.length === 9) {
            fetchViaCep(finalValue);
        } else if (name === 'cep' && finalValue.length < 9) {
            setCepLocked({ rua: false, bairro: false, cidade: false, estado: false });
        }

        if (type !== 'checkbox') {
            checkProgress(name, finalValue);
        }
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
                    cep: '', rua: '', bairro: '', cidade: '', estado: '',
                    tipoCombustivel: 'NAO_INFORMADO', aceiteLgpd: false,
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
                <div ref={dadosPessoaisRef} className={styles.dynamicFormAnimation}>
                    <h3 className={styles.sectionTitle}>2. Seus Dados Pessoais</h3>

                    <div className={styles.inputGrid}>
                        <div className={styles.inputGroupFull}>
                            <label>Nome Completo</label>
                            <input ref={nomeInputRef} type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleInputChange} required />
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
                            <label>CEP</label>
                            <input type="text" name="cep" value={formData.cep} onChange={handleInputChange} maxLength={9} placeholder="00000-000" required />
                        </div>

                        <div className={styles.inputGroupFull}>
                            <label>Rua / Logradouro</label>
                            <input type="text" name="rua" value={formData.rua} onChange={handleInputChange} disabled={cepLocked.rua} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Bairro</label>
                            <input type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} disabled={cepLocked.bairro} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Cidade</label>
                            <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} disabled={cepLocked.cidade} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Estado (UF)</label>
                            <input type="text" name="estado" value={formData.estado} onChange={handleInputChange} maxLength={2} disabled={cepLocked.estado} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Combustível do Veículo</label>
                            <select name="tipoCombustivel" value={formData.tipoCombustivel} onChange={handleInputChange} required>
                                <option value="NAO_INFORMADO">Não Informado</option>
                                <option value="GASOLINA">Gasolina</option>
                                <option value="ETANOL">Etanol</option>
                                <option value="DIESEL">Diesel</option>
                                <option value="ELETRICO">Elétrico</option>
                            </select>
                        </div>
                    </div>

                    {/* DADOS ESPECÍFICOS */}
                    {(role === 'expositor' || role === 'cafeicultor' || role === 'imprensa') && (
                        <div ref={dadosEspecificosRef}>
                            <h3 className={styles.sectionTitle}>3. Informações Complementares ({role})</h3>
                            <div className={styles.inputGrid}>

                                {role === 'expositor' && (
                                    <>
                                        <div className={styles.inputGroup}>
                                            <label>CNPJ</label>
                                            <input ref={cnpjInputRef} type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} required />
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
                                            <input ref={ccirInputRef} type="text" name="ccir" value={formData.ccir} onChange={handleInputChange} required />
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
                                            <input ref={cnpjInputRef} type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} required />
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
                        </div>
                    )}

                    {/* TERMOS LGPD */}
                    <div ref={lgpdRef} className={styles.lgpdSection}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="aceiteLgpd"
                                checked={formData.aceiteLgpd}
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
