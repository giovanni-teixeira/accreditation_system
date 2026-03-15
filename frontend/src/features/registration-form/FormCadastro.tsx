'use client';

import { useState, useTransition, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import styles from './FormCadastro.module.css';
import { cadastrarUsuario, CadastroResponse } from '@/controllers/CredenciadoController';
import { MaskUtils } from '@/utils/mask.utils';
import { Validador } from '@/utils/validation.utils';
import { COUNTRIES } from '@/constants/countries';
import { useAddress } from '@/hooks/useAddress';

// Componentes UI Atômicos baseada no feedback do usuário.
import { RoleCard } from '@/components/ui/RoleCard';
import { InputGroup } from '@/components/ui/InputGroup';
import { SearchableInput } from '@/components/ui/SearchableInput';

// Seções da Feature baseada no feedback do usuário.
import { AddressSection } from './AddressSection';
import { ComplementarySection } from './ComplementarySection';

const ROLES = [
    { id: 'expositor', label: 'Expositor', icon: '🏢' },
    { id: 'produtor', label: 'Produtor', icon: '🌱' },
    { id: 'visitante', label: 'Visitante', icon: '🎟️' },
    { id: 'imprensa', label: 'Imprensa', icon: '📸' }
];

interface FormDataState {
    nomeCompleto: string; cpf: string; rg: string; celular: string; email: string;
    cep: string; pais: string; rua: string; bairro: string; cidade: string; estado: string;
    tipoCombustivel: string; aceiteLgpd: boolean;
    cnpj: string; siteEmpresa: string; nomeEmpresa: string;
    ccir: string; nomePropriedade: string; nomeVeiculo: string;
    semCep: boolean; distanciaManualKm: string;
}

interface FormCadastroProps {
    onResult: (result: CadastroResponse) => void;
    isBlocked?: boolean;
}

export default function FormCadastro({ onResult, isBlocked = false }: FormCadastroProps) {
    const [role, setRole] = useState<string>('');
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<{ cpf?: string; cnpj?: string; lgpd?: boolean }>({});

    const [formData, setFormData] = useState<FormDataState>({
        nomeCompleto: '', cpf: '', rg: '', celular: '', email: '',
        cep: '', pais: 'Brasil', rua: '', bairro: '', cidade: '', estado: '',
        tipoCombustivel: '', aceiteLgpd: false,
        cnpj: '', siteEmpresa: '', nomeEmpresa: '',
        ccir: '', nomePropriedade: '', nomeVeiculo: '',
        semCep: false, distanciaManualKm: ''
    });

    const { cepLocked, setCepLocked, fetchAddress } = useAddress(formData.pais);

    const dadosPessoaisRef = useRef<HTMLDivElement>(null);
    const nomeInputRef = useRef<HTMLInputElement>(null);
    const cnpjInputRef = useRef<HTMLInputElement>(null);
    const ccirInputRef = useRef<HTMLInputElement>(null);

    const formDisabled = isPending || isBlocked;

    useEffect(() => {
        if (role && dadosPessoaisRef.current) {
            dadosPessoaisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => nomeInputRef.current?.focus(), 500);
        }
    }, [role]);

    const handleFetchAddress = async (cep: string) => {
        const data = await fetchAddress(cep);
        if (data) {
            setFormData(prev => ({
                ...prev,
                rua: data.rua || '',
                bairro: data.bairro || '',
                cidade: data.cidade || '',
                estado: data.estado || ''
            }));
        } else {
            setFormData(prev => ({ ...prev, rua: '', bairro: '', cidade: '', estado: '' }));
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        let finalValue = value;

        if (name === 'cep') finalValue = formData.pais === 'Brasil' ? MaskUtils.cep(value) : value.toUpperCase();
        else if (name === 'cpf') finalValue = formData.pais === 'Brasil' ? MaskUtils.cpf(value) : value.toUpperCase();
        else if (name === 'celular') finalValue = formData.pais === 'Brasil' ? MaskUtils.celular(value) : value;
        else if (name === 'cnpj') finalValue = formData.pais === 'Brasil' ? MaskUtils.cnpj(value) : value.toUpperCase();
        else if (name === 'ccir') finalValue = MaskUtils.ccir(value);

        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : finalValue }));

        if (name === 'cep' && ((formData.pais === 'Brasil' && finalValue.length === 9) || (formData.pais !== 'Brasil' && finalValue.length >= 4))) {
            handleFetchAddress(finalValue);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.aceiteLgpd) {
            setErrors(prev => ({ ...prev, lgpd: true }));
            onResult({ sucesso: false, mensagem: 'Leia e aceite os termos da LGPD.' });
            return;
        }

        setErrors(prev => ({ ...prev, lgpd: false }));

        startTransition(async () => {
            const finalCelular = (formData.pais === 'Brasil' && !formData.celular.startsWith('+55')) 
                ? `+55${formData.celular.replace(/\D/g, '')}` 
                : formData.celular;

            const cleanData = { ...formData, celular: finalCelular, role };

            // Sanitização de campos numéricos e opcionais baseada no feedback do usuário.
            if (cleanData.semCep && cleanData.distanciaManualKm) {
                cleanData.distanciaManualKm = Number(cleanData.distanciaManualKm) as any;
            } else {
                delete (cleanData as any).distanciaManualKm;
            }

            // Remove strings vazias de campos opcionais para evitar erros de validação no backend baseada no feedback do usuário.
            ['rg', 'cnpj', 'ccir', 'nomeEmpresa', 'siteEmpresa', 'nomePropriedade', 'nomeVeiculo', 'cep', 'rua', 'bairro'].forEach(key => {
                if (!(cleanData as any)[key]) {
                    delete (cleanData as any)[key];
                }
            });

            const result: CadastroResponse = await cadastrarUsuario(cleanData);
            onResult(result);
            if (result.sucesso) {
                setFormData({
                    nomeCompleto: '', cpf: '', rg: '', celular: '', email: '',
                    cep: '', pais: 'Brasil', rua: '', bairro: '', cidade: '', estado: '',
                    tipoCombustivel: '', aceiteLgpd: false,
                    cnpj: '', siteEmpresa: '', nomeEmpresa: '',
                    ccir: '', nomePropriedade: '', nomeVeiculo: '',
                    semCep: false, distanciaManualKm: ''
                });
                setRole('');
            }
        });
    };

    return (
        <form id="cadastroForm" className={styles.formContainer} onSubmit={handleSubmit}>
            <fieldset disabled={formDisabled} style={{ border: 'none', padding: 0, margin: 0, width: '100%' }}>
                <div className={styles.roleSelection}>
                    <h3 className={styles.sectionTitle}>1. Escolha seu Perfil</h3>
                    <div className={styles.radioGrid}>
                        {ROLES.map(r => (
                            <RoleCard
                                key={r.id}
                                {...r}
                                isSelected={role === r.id}
                                onClick={setRole}
                                disabled={formDisabled}
                            />
                        ))}
                    </div>
                </div>

                {role && (
                    <div ref={dadosPessoaisRef} className={styles.dynamicFormAnimation}>
                        <div className={styles.inputGrid}>
                            <div className={styles.inputGroupFull}>
                                <InputGroup label="Nome Completo" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleInputChange} required ref={nomeInputRef} placeholder="Digite seu nome completo" />
                            </div>

                            <SearchableInput
                                label="País"
                                value={formData.pais}
                                options={COUNTRIES}
                                onSelect={(opt) => {
                                    setFormData(prev => ({ 
                                        ...prev, 
                                        pais: opt.name, 
                                        cep: '', 
                                        rua: '', 
                                        bairro: '', 
                                        cidade: '', 
                                        estado: '',
                                        semCep: false,
                                        distanciaManualKm: ''
                                    }));
                                    setCepLocked({ rua: false, bairro: false, cidade: false, estado: false });
                                }}
                                placeholder="Brasil"
                                required
                                disabled={formDisabled}
                            />
                            
                            <InputGroup 
                                label={formData.pais === 'Brasil' ? 'CPF' : 'Documento de Identificação'} 
                                name="cpf" 
                                value={formData.cpf} 
                                onChange={handleInputChange} 
                                error={errors.cpf} 
                                onBlur={(e) => {
                                    if (formData.pais === 'Brasil' && e.target.value) {
                                        if (!Validador.validarCPF(e.target.value)) {
                                            setErrors(prev => ({ ...prev, cpf: 'Documento inválido' }));
                                        } else {
                                            setErrors(prev => ({ ...prev, cpf: undefined }));
                                        }
                                    } else if (formData.pais !== 'Brasil') {
                                        setErrors(prev => ({ ...prev, cpf: undefined }));
                                    }
                                }}
                                required 
                                placeholder={formData.pais === 'Brasil' ? '000.000.000-00' : 'Passaporte ou ID'}
                            />

                            {formData.pais === 'Brasil' && (
                                <InputGroup label="RG" name="rg" value={formData.rg} onChange={handleInputChange} placeholder="Opcional" />
                            )}
                            <InputGroup label="Celular (WhatsApp)" name="celular" value={formData.celular} onChange={handleInputChange} required placeholder="(00) 00000-0000" />
                            
                            <div className={styles.inputGroupFull}>
                                <InputGroup label="E-mail" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="exemplo@email.com" />
                            </div>
                        </div>

                        <h3 className={styles.sectionTitle}>3. Seu Endereço</h3>
                        <AddressSection
                            formData={formData}
                            cepLocked={cepLocked}
                            formDisabled={formDisabled}
                            handleInputChange={handleInputChange}
                            handleCepBlur={() => formData.cep && handleFetchAddress(formData.cep)}
                            handleCepKeyDown={(e) => e.key === 'Enter' && handleFetchAddress(formData.cep)}
                            handleStateSelect={(code) => setFormData((prev: any) => ({ ...prev, estado: code }))}
                            setFormData={setFormData}
                            setCepLocked={setCepLocked}
                        />

                        <ComplementarySection
                            role={role}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            formDisabled={formDisabled}
                            cnpjInputRef={cnpjInputRef}
                            ccirInputRef={ccirInputRef}
                        />

                        <div className={`${styles.lgpdSection} ${errors.lgpd ? styles.lgpdError : ''}`}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="aceiteLgpd" checked={formData.aceiteLgpd} onChange={handleInputChange} />
                                <span className={styles.checkmark}></span>
                                <span>
                                    Declaro que li e concordo com a coleta e tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD) e autorizo o envio de comunicações sobre o evento Alta Café. Acesse a 
                                    <a href="/politica-privacidade" target="_blank" className={styles.lgpdLink}>Política de Privacidade aqui.</a>
                                </span>
                            </label>
                            {errors.lgpd && <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '5px' }}>Você precisa aceitar os termos para continuar.</p>}
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            {isPending ? 'PROCESSANDO...' : 'CONCLUIR CREDENCIAMENTO'}
                        </button>
                    </div>
                )}
            </fieldset>
        </form>
    );
}
