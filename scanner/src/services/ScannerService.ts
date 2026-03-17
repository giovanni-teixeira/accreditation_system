import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

export interface ScanResult {
    isValid: boolean;
    data?: {
        eventoId: string;
        ticketId: string;
        nome: string;
    };
    error?: string;
}

export class ScannerService {

    static validateScan(decodedText: string, publicKey: string): ScanResult {
        try {
            const parts = decodedText.split('.');
            if (parts.length !== 2) {
                return { isValid: false, error: 'Token adulterado (formato inválido)' };
            }

            const payloadRaw = parts[0];
            const signatureBase64 = parts[1];


            const messageUint8 = util.decodeUTF8(payloadRaw);
            const signatureUint8 = util.decodeBase64(signatureBase64);
            const publicKeyUint8 = util.decodeBase64(publicKey);

            const isValid = nacl.sign.detached.verify(messageUint8, signatureUint8, publicKeyUint8);

            if (!isValid) {
                return { isValid: false, error: 'Assinatura Inválida - O QR Code foi adulterado ou pertence a outro evento.' };
            }

            const [eventoId, ticketId, nome] = payloadRaw.split('|');

            return {
                isValid: true,
                data: {
                    eventoId,
                    ticketId,
                    nome: nome || 'Não informado'
                }
            };

        } catch (err: any) {
            console.error('Erro na validação do scan:', err);
            return { isValid: false, error: err.message || 'Dados corrompidos ou ilegíveis.' };
        }
    }
}
