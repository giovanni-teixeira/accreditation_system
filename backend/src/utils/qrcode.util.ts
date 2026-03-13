// src/utils/qrcode.util.ts
import * as nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import * as crypto from 'crypto';


export interface QrCodeResult {
  ticketId: string;
  qrToken: string;
}

export const QrCodeHelper = {
  /**
   * Assina um identificador compacto (eventoId|ticketId) e retorna o token formatado.
   * Formato Final: eventoId|ticketId.assinaturaBase64
   */
  signPayload(eventoId: string, ticketId: string, privateKeyBase64: string): string {
    // Formato ultra-compacto: remove overhead de JSON
    const messageStr = `${eventoId}|${ticketId}`;
    const message = util.decodeUTF8(messageStr);
    const privateKey = util.decodeBase64(privateKeyBase64);
    
    const signature = nacl.sign.detached(message, privateKey);

    // Formato: identificador.assinatura (Economiza espaço no QR)
    return `${messageStr}.${util.encodeBase64(signature)}`;
  },

  generateSignedToken(
    eventoId: string,
    privateKeyBase64: string,
    _nome: string, // Mantido na assinatura para compatibilidade, mas não usado no QR
  ): QrCodeResult {
    // TicketId curto (10 chars hex) em vez de UUID (36 chars)
    const ticketId = crypto.randomBytes(5).toString('hex').toUpperCase();
    const qrToken = this.signPayload(eventoId, ticketId, privateKeyBase64);

    return { ticketId, qrToken };
  },
};
