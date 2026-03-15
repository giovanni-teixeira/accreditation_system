'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './style.module.css';
import { MaskUtils } from '@/utils/mask.utils';
import { buscarPorCpf, CadastroResponse } from '@/controllers/CredenciadoController';

interface SearchCPFProps {
    onSearchResult: (result: CadastroResponse) => void;
}

export default function SearchCPF({ onSearchResult }: SearchCPFProps) {
    const [cpf, setCpf] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Se contiver qualquer letra, switch para PassportID, senão mantém CPF
        const hasLetters = /[a-zA-Z]/.test(val);
        const masked = hasLetters ? MaskUtils.passportID(val) : MaskUtils.cpf(val);
        setCpf(masked);
    };

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (cpf.length < 3) return; // Permitir buscar IDs menores se necessário baseada no feedback do usuário.

        setIsLoading(true);
        try {
            const result = await buscarPorCpf(cpf);
            onSearchResult(result);
            if (result.sucesso) {
                setCpf('');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            className={`${styles.searchContainer} ${isFocused || cpf ? styles.active : ''}`}
            onSubmit={handleSearch}
        >
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    className={styles.input}
                    value={cpf}
                    onChange={handleCpfChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={isFocused ? "Ex: 000.000.000-00 ou AB1234567" : ""}
                    maxLength={14}
                />
                <label className={styles.label}>Buscar credencial pelo CPF / Passport / ID</label>
                <button
                    type="submit"
                    className={styles.searchIcon}
                    disabled={isLoading || cpf.length < 3}
                    title="Buscar"
                >
                    {isLoading ? (
                        <div className={styles.loadingSpinner}></div>
                    ) : (
                        "🔍"
                    )}
                </button>
            </div>
        </form>
    );
}
