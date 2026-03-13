'use client';

import { useState, useTransition, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import styles from './style.module.css';
import { cadastrarUsuario, CadastroResponse } from '@/controllers/CredenciadoController';
import { API_ROUTES } from '@/config/api';
import { MaskUtils } from '@/utils/mask.utils';
import SuccessModal from '../SuccessModal';
import ErrorModal from '../ErrorModal';

const ROLES = [
    { id: 'expositor', label: 'Expositor', icon: '🏢' },
    { id: 'produtor', label: 'Produtor', icon: '🌱' },
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
    pais: string;
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

interface FormCadastroProps {
    onResult: (result: CadastroResponse) => void;
}

export default function FormCadastro({ onResult }: FormCadastroProps) {
    const [role, setRole] = useState<string>('');
    const [isPending, startTransition] = useTransition();
    const [cepLocked, setCepLocked] = useState({ rua: false, bairro: false, cidade: false, estado: false });

    const [formData, setFormData] = useState<FormDataState>({
        nomeCompleto: '', cpf: '', rg: '', celular: '', email: '',
        cep: '', pais: 'Brasil', rua: '', bairro: '', cidade: '', estado: '',
        tipoCombustivel: 'NAO_INFORMADO', aceiteLgpd: false,
        cnpj: '', siteEmpresa: '', nomeEmpresa: '',
        ccir: '', nomePropriedade: '', nomeVeiculo: ''
    });

    const dadosPessoaisRef = useRef<HTMLDivElement>(null);
    const dadosEspecificosRef = useRef<HTMLDivElement>(null);
    const lgpdRef = useRef<HTMLDivElement>(null);

    const nomeInputRef = useRef<HTMLInputElement>(null);
    const cnpjInputRef = useRef<HTMLInputElement>(null);
    const ccirInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (role && dadosPessoaisRef.current) {
            dadosPessoaisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => nomeInputRef.current?.focus(), 500);
        }
    }, [role]);

    const fetchAddress = async (cepText: string) => {
        const zipCode = cepText.replace(/\D/g, '');

        // No Brasil, espera 8 dígitos. Fora, deixamos livre mas avisamos o backend.
        if (formData.pais === 'Brasil' && zipCode.length !== 8) return;

        try {
            const res = await fetch(API_ROUTES.ADDRESS.BUSCAR(zipCode, formData.pais));
            if (!res.ok) throw new Error('Não encontrado');
            
            const data = await res.json();

            setFormData(prev => ({
                ...prev,
                rua: data.rua || prev.rua,
                bairro: data.bairro || prev.bairro,
                cidade: data.cidade || prev.cidade,
                estado: data.estado || prev.estado
            }));
            
            setCepLocked({
                rua: !!data.rua,
                bairro: !!data.bairro,
                cidade: !!data.cidade,
                estado: !!data.estado
            });
        } catch (err) {
            console.error('Erro na consulta de endereço centralizada:', err);
            setCepLocked({ rua: false, bairro: false, cidade: false, estado: false });
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        let finalValue = value;

        // Delega a aplicação de máscaras para o utilitário MaskUtils
        // Delega a aplicação de máscaras para o utilitário MaskUtils
        if (name === 'cep') {
            finalValue = formData.pais === 'Brasil' ? MaskUtils.cep(value) : value.toUpperCase();
        } else if (name === 'cpf') finalValue = MaskUtils.cpf(value);
        else if (name === 'celular') finalValue = MaskUtils.celular(value);
        else if (name === 'rg') finalValue = MaskUtils.rg(value);
        else if (name === 'cnpj') finalValue = MaskUtils.cnpj(value);
        else if (name === 'ccir') finalValue = MaskUtils.ccir(value);

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : finalValue
        }));

        if (name === 'cep' && ((formData.pais === 'Brasil' && finalValue.length === 9) || (formData.pais !== 'Brasil' && finalValue.length >= 4))) {
            fetchAddress(finalValue);
        } else if (name === 'cep') {
            setCepLocked({ rua: false, bairro: false, cidade: false, estado: false });
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.aceiteLgpd) {
            onResult({
                sucesso: false,
                mensagem: 'É necessário ler e aceitar os termos da LGPD (Política de Privacidade) para concluir o credenciamento.'
            });
            return;
        }

        startTransition(async () => {
            const cleanData: any = { ...formData, role };

            // Processamento de dados antes do envio (uppercase e remoção de máscaras)
            for (const key in cleanData) {
                if (typeof cleanData[key] === 'string') {
                    if (['cpf', 'celular', 'cnpj', 'ccir', 'cep'].includes(key)) {
                        cleanData[key] = MaskUtils.unmask(cleanData[key]);
                    } else if (key === 'rg') {
                        cleanData[key] = cleanData[key].replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                    } else if (key !== 'role' && key !== 'email') {
                        cleanData[key] = cleanData[key].toUpperCase();
                    }
                }
            }

            const result: CadastroResponse = await cadastrarUsuario(cleanData);
            onResult(result);

            if (result.sucesso) {
                setFormData({
                    nomeCompleto: '', cpf: '', rg: '', celular: '', email: '',
                    cep: '', pais: 'Brasil', rua: '', bairro: '', cidade: '', estado: '',
                    tipoCombustivel: 'NAO_INFORMADO', aceiteLgpd: false,
                    cnpj: '', siteEmpresa: '', nomeEmpresa: '',
                    ccir: '', nomePropriedade: '', nomeVeiculo: ''
                });
            }
        });
    };

    return (
        <>
            <form id="cadastroForm" className={styles.formContainer} onSubmit={handleSubmit}>
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
                                <label>País</label>
                                <select name="pais" value={formData.pais} onChange={handleInputChange} required>
                                    <option value="Brasil">Brasil</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="Colômbia">Colômbia</option>
                                    <option value="Estados Unidos">Estados Unidos</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>{formData.pais === 'Brasil' ? 'CEP' : 'ZIP / Postcode'}</label>
                                <input type="text" name="cep" value={formData.cep} onChange={handleInputChange} maxLength={ formData.pais === 'Brasil' ? 9 : 15} placeholder={formData.pais === 'Brasil' ? "00000-000" : "Código Postal"} required />
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
                        {(role === 'expositor' || role === 'produtor' || role === 'imprensa') && (
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

                                    {role === 'produtor' && (
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
                                />
                                <span className={styles.checkmark}></span>
                                Declaro que li e concordo com a coleta e tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD) e autorizo o envio de comunicações sobre o evento Alta Café. Acesse a
                                <a
                                    href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.lgpdLink}
                                >
                                    Política de Privacidade aqui.
                                </a>
                            </label>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isPending}>
                            {isPending ? 'Processando...' : 'Finalizar Credenciamento'}
                        </button>
                    </div>
                )}
            </form>
        </>
    );
}
