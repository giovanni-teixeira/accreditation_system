import { ChangeEvent, forwardRef } from 'react';
import styles from './InputGroup.module.css';

interface InputGroupProps {
    label: string;
    name?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onBlur?: (e: any) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    fullWidth?: boolean;
    maxLength?: number;
}

export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(({
    label,
    name,
    value,
    onChange,
    onBlur,
    type = 'text',
    placeholder,
    required = false,
    disabled = false,
    error,
    fullWidth = false,
    maxLength
}, ref) => {
    return (
        <div className={`${styles.inputGroup} ${fullWidth ? styles.inputGroupFull : ''}`}>
            <label>{label}</label>
            <input
                ref={ref}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                maxLength={maxLength}
            />
            {error && <span className={styles.validationError}>{error}</span>}
        </div>
    );
});

InputGroup.displayName = 'InputGroup';
