import { ChangeEvent, RefObject } from 'react';
import styles from './FormCadastro.module.css';
import { InputGroup } from '@/components/ui/InputGroup';

interface ComplementarySectionProps {
    role: string;
    formData: any;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    formDisabled: boolean;
    cnpjInputRef: RefObject<HTMLInputElement | null>;
    errors: any;
    onCnpjBlur: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function ComplementarySection({
    role,
    formData,
    handleInputChange,
    formDisabled,
    cnpjInputRef,
    errors,
    onCnpjBlur
}: ComplementarySectionProps) {
    if (!['expositor', 'produtor', 'imprensa'].includes(role)) return null;

    return (
        <div>
            <h3 className={styles.sectionTitle}>4. Informações Complementares ({role.toUpperCase()})</h3>
            <div className={styles.inputGrid}>
                {role === 'expositor' && (
                    <>
                        <InputGroup
                            label="CNPJ da Empresa"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleInputChange}
                            placeholder="00.000.000/0000-00"
                            required={formData.pais === 'Brasil'}
                            disabled={formDisabled}
                            ref={cnpjInputRef}
                            error={errors.cnpj}
                            onBlur={onCnpjBlur}
                        />
                        <InputGroup
                            label="Nome da Empresa"
                            name="nomeEmpresa"
                            value={formData.nomeEmpresa}
                            onChange={handleInputChange}
                            placeholder="Nome Fantasia"
                            required
                            disabled={formDisabled}
                        />
                        <InputGroup
                            label="Site / Instagram"
                            name="siteEmpresa"
                            value={formData.siteEmpresa}
                            onChange={handleInputChange}
                            placeholder="www.empresa.com.br (Opcional)"
                            disabled={formDisabled}
                        />
                    </>
                )}

                {role === 'produtor' && (
                    <>
                        <InputGroup
                            label="Nome da Propriedade"
                            name="nomePropriedade"
                            value={formData.nomePropriedade}
                            onChange={handleInputChange}
                            placeholder="Ex: Fazenda Bela Vista"
                            required
                            disabled={formDisabled}
                        />
                    </>
                )}

                {role === 'imprensa' && (
                    <>
                        <InputGroup
                            label="Veículo de Imprensa"
                            name="nomeVeiculo"
                            value={formData.nomeVeiculo}
                            onChange={handleInputChange}
                            placeholder="Nome do Jornal / Portal"
                            required
                            disabled={formDisabled}
                        />
                        <InputGroup
                            label="Página / Rede Social"
                            name="siteEmpresa"
                            value={formData.siteEmpresa}
                            onChange={handleInputChange}
                            placeholder="link da página (Opcional)"
                            disabled={formDisabled}
                        />
                        <InputGroup
                            label="CNPJ da Imprensa"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleInputChange}
                            placeholder="00.000.000/0000-00 (Opcional)"
                            disabled={formDisabled}
                            ref={cnpjInputRef}
                            error={errors.cnpj}
                            onBlur={onCnpjBlur}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
