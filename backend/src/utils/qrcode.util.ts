// src/utils/qrcode.util.ts
import * as nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import * as crypto from 'crypto';

export interface QrCodeResult {
  ticketId: string;
  qrToken: string;
}

export const QrCodeHelper = {
  signPayload(
    eventoId: string,
    ticketId: string,
    privateKeyBase64: string,
  ): string {
    try {
      if (!privateKeyBase64) {
        throw new Error('Chave privada do evento não encontrada.');
      }

      const messageStr = `${eventoId}|${ticketId}`;
      const message = util.decodeUTF8(messageStr);
      const privateKey = util.decodeBase64(privateKeyBase64);

      const signature = nacl.sign.detached(message, privateKey);

      return `${messageStr}.${util.encodeBase64(signature)}`;
    } catch (error) {
      throw new Error(`Falha na geração da assinatura do QR: ${error.message}`);
    }
  },

  generateSignedToken(
    eventoId: string,
    privateKeyBase64: string,
    _nome: string,
  ): QrCodeResult {
    try {
      const ticketId = crypto.randomBytes(5).toString('hex').toUpperCase();
      const qrToken = this.signPayload(eventoId, ticketId, privateKeyBase64);

      return { ticketId, qrToken };
    } catch (error) {
      throw error;
    }
  },
};
