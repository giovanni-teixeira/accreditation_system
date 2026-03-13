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
        const masked = MaskUtils.cpf(e.target.value);
        setCpf(masked);
    };

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (cpf.length < 14) return;

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
                    placeholder={isFocused ? "000.000.000-00" : ""}
                    maxLength={14}
                />
                <label className={styles.label}>Buscar credencial pelo CPF</label>
                <button
                    type="submit"
                    className={styles.searchIcon}
                    disabled={isLoading || cpf.length < 14}
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
