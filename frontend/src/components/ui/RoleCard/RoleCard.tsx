import styles from './RoleCard.module.css';

interface RoleCardProps {
    id: string;
    label: string;
    icon: string;
    isSelected: boolean;
    onClick: (id: string) => void;
    disabled?: boolean;
}

export function RoleCard({ id, label, icon, isSelected, onClick, disabled = false }: RoleCardProps) {
    return (
        <label className={`${styles.radioCard} ${isSelected ? styles.selected : ''} ${disabled ? styles.disabledCard : ''}`}>
            <input
                type="radio"
                name="role"
                value={id}
                checked={isSelected}
                onChange={() => !disabled && onClick(id)}
                className={styles.hiddenRadio}
                disabled={disabled}
            />
            <span className={styles.cardIcon}>{icon}</span>
            <span className={styles.cardLabel}>{label}</span>
        </label>
    );
}
