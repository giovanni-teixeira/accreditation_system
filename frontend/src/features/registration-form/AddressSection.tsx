import { ChangeEvent } from 'react';
import styles from './FormCadastro.module.css';
import { InputGroup } from '@/components/ui/InputGroup';
import { SearchableInput } from '@/components/ui/SearchableInput';
import { BRAZILIAN_STATES } from '@/constants/states';

interface AddressSectionProps {
    formData: any;
    cepLocked: any;
    formDisabled: boolean;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleCepBlur: () => void;
    handleCepKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleStateSelect: (code: string, name: string) => void;
    setFormData: any;
    setCepLocked: any;
}

export function AddressSection({
    formData,
    cepLocked,
    formDisabled,
    handleInputChange,
    handleCepBlur,
    handleCepKeyDown,
    handleStateSelect,
    setFormData,
    setCepLocked
}: AddressSectionProps) {
    const isBrasil = formData.pais === 'Brasil';

    return (
        <div className={styles.inputGrid}>
            {/* Linha 1: [CEP ou ESTADO] + Cidade. */}
            <div className={styles.inputGroup}>
                <div className={styles.labelWithAction}>
                    <label>
                        {formData.semCep
                            ? (isBrasil ? 'Estado (UF)' : 'Estado / Província')
                            : (isBrasil ? 'CEP' : 'ZIP / Postcode')}
                    </label>
                    {!formDisabled && (
                        <label className={styles.inlineCheckbox}>
                            <input
                                type="checkbox"
                                name="semCep"
                                checked={formData.semCep}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        semCep: checked,
                                        cep: checked ? '' : prev.cep,
                                        rua: checked ? '' : prev.rua,
                                        bairro: checked ? '' : prev.bairro,
                                        cidade: checked ? '' : prev.cidade,
                                        estado: checked ? '' : prev.estado,
                                        distanciaManualKm: ''
                                    }));
                                    if (checked) {
                                        setCepLocked({ rua: false, bairro: false, cidade: false, estado: false });
                                    }
                                }}
                            />
                            {isBrasil ? 'Não tenho um CEP' : 'Não tenho um ZipCode'}
                        </label>
                    )}
                </div>

                {formData.semCep ? (
                    // Estado no lugar do CEP quando semCep é true.
                    isBrasil ? (
                        <SearchableInput
                            label=""
                            value={BRAZILIAN_STATES.find(s => s.code === formData.estado)?.name || ''}
                            options={BRAZILIAN_STATES}
                            onSelect={(opt: { code: string; name: string }) => handleStateSelect(opt.code, opt.name)}
                            placeholder="Escolha o estado..."
                            required
                            disabled={formDisabled}
                        />
                    ) : (
                        <input
                            type="text"
                            name="estado"
                            value={formData.estado}
                            onChange={handleInputChange}
                            placeholder="Estado ou Província"
                            required
                            disabled={formDisabled}
                        />
                    )
                ) : (
                    // CEP normal .
                    <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleInputChange}
                        onBlur={handleCepBlur}
                        onKeyDown={handleCepKeyDown}
                        maxLength={isBrasil ? 9 : 15}
                        placeholder={isBrasil ? "00000-000" : "Zip / Postcode"}
                        required={!formData.semCep}
                        disabled={formDisabled}
                    />
                )}
            </div>

            <InputGroup
                label="Cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                disabled={(!formData.semCep && cepLocked.cidade) || formDisabled}
                placeholder="Sua cidade"
                required
            />

            {/* Linha 2 de Rua + Número (apenas se tiver CEP) */}
            {!formData.semCep && (
                <div className={styles.addressRow}>
                    <InputGroup
                        label="Rua / Logradouro"
                        name="rua"
                        value={formData.rua}
                        onChange={handleInputChange}
                        disabled={cepLocked.rua || formDisabled}
                        placeholder="Nome da rua"
                        required
                    />

                    <InputGroup
                        label="Número"
                        name="numero"
                        value={formData.numero}
                        onChange={handleInputChange}
                        disabled={formDisabled}
                        placeholder="Nº"
                        required
                    />
                </div>
            )}

            {/* Linha 3: Bairro + [Estado ou Combustível] . */}
            <InputGroup
                label="Bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                disabled={(cepLocked.bairro && !formData.semCep) || formDisabled}
                placeholder="Seu bairro"
                required={!formData.semCep}
            />

            {formData.semCep ? (
                // Se não tem CEP, o Combustível sobe para o lado do Bairro.
                <div className={styles.inputGroup}>
                    <label>Combustível do Veículo</label>
                    <select name="tipoCombustivel" value={formData.tipoCombustivel} onChange={handleInputChange} required disabled={formDisabled}>
                        <option value="" disabled>Selecione uma opção</option>
                        <option value="GASOLINA">Gasolina</option>
                        <option value="ETANOL">Etanol</option>
                        <option value="DIESEL">Diesel</option>
                        <option value="ELETRICO">Elétrico</option>
                        <option value="NAO_INFORMADO">Não Informado</option>
                    </select>
                </div>
            ) : (
                // Se tem CEP, o Estado fica aqui.
                isBrasil ? (
                    <InputGroup
                        label="Estado (UF)"
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        maxLength={10}
                        disabled={cepLocked.estado || formDisabled}
                        placeholder="UF"
                        required
                    />
                ) : (
                    <InputGroup
                        label="Estado / Província"
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        placeholder="Estado"
                        required
                        disabled={formDisabled}
                    />
                )
            )}

            {/* Linha 4: Combustível (se tem CEP) ou Distância (se não tem CEP). */}
            {formData.semCep ? (
                <InputGroup
                    label="Distância estimada (km ida)"
                    name="distanciaManualKm"
                    type="number"
                    value={formData.distanciaManualKm}
                    onChange={handleInputChange}
                    placeholder="Ex: 50"
                    required={formData.semCep}
                    disabled={formDisabled}
                />
            ) : (
                <div className={styles.inputGroup}>
                    <label>Combustível do Veículo</label>
                    <select name="tipoCombustivel" value={formData.tipoCombustivel} onChange={handleInputChange} required disabled={formDisabled}>
                        <option value="" disabled>Selecione uma opção</option>
                        <option value="GASOLINA">Gasolina</option>
                        <option value="ETANOL">Etanol</option>
                        <option value="DIESEL">Diesel</option>
                        <option value="ELETRICO">Elétrico</option>
                    </select>
                </div>
            )}
        </div>
    );
}
