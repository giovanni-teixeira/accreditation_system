import { useState, useRef, useEffect } from 'react';
import styles from './SearchableInput.module.css';

interface Option {
    code: string;
    name: string;
}

interface SearchableInputProps {
    label: string;
    value: string;
    options: Option[];
    onSelect: (option: Option) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

export function SearchableInput({
    label,
    value,
    options,
    onSelect,
    placeholder,
    required = false,
    disabled = false
}: SearchableInputProps) {
    const [search, setSearch] = useState(value);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearch(value);
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                setSearch(value);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    const filtered = (search === value) 
        ? options 
        : options.filter(opt =>
            opt.name.toLowerCase().includes(search.toLowerCase()) ||
            opt.code.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className={styles.inputGroup} ref={containerRef}>
            {label && <label>{label}</label>}
            <div className={styles.countrySearchContainer}>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    required={required}
                    disabled={disabled}
                />
                {showDropdown && (
                    <div className={styles.countriesDropdown}>
                        {filtered.length > 0 ? (
                            filtered.map(opt => (
                                <div
                                    key={opt.code}
                                    className={styles.countryOption}
                                    onClick={() => {
                                        onSelect(opt);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <span>{opt.name}</span>
                                    <span className={styles.countryCode}>{opt.code}</span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>Não encontrado</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
