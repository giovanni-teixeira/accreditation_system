import { useState, useCallback } from 'react';
import { API_ROUTES } from '@/config/api';

interface AddressData {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export function useAddress(pais: string) {
    const [cepLocked, setCepLocked] = useState({
        rua: false,
        bairro: false,
        cidade: false,
        estado: false
    });

    const fetchAddress = useCallback(async (cepText: string) => {
        const isBrasil = pais === 'Brasil';
        const zipCode = isBrasil 
            ? cepText.replace(/\D/g, '') 
            : cepText.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        if (isBrasil && zipCode.length !== 8) return null;
        if (!isBrasil && zipCode.length < 3) return null;

        try {
            const res = await fetch(API_ROUTES.ADDRESS.BUSCAR(zipCode, pais));
            if (!res.ok) throw new Error('CEP não encontrado');
            
            const data: AddressData = await res.json();
            
            setCepLocked({
                rua: !!data.rua,
                bairro: !!data.bairro,
                cidade: !!data.cidade,
                estado: !!data.estado
            });

            return data;
        } catch (err) {
            console.error('Erro na consulta de endereço:', err);
            setCepLocked({ rua: false, bairro: false, cidade: false, estado: false });
            return null;
        }
    }, [pais]);

    return {
        cepLocked,
        setCepLocked,
        fetchAddress
    };
}
