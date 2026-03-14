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
    nome: string,
    privateKeyBase64: string,
  ): string {
    const messageStr = `${eventoId}|${ticketId}|${nome.substring(0, 25).toUpperCase()}`;
    const message = util.decodeUTF8(messageStr);
    const privateKey = util.decodeBase64(privateKeyBase64);

    const signature = nacl.sign.detached(message, privateKey);

    return `${messageStr}.${util.encodeBase64(signature)}`;
  },

  generateSignedToken(
    eventoId: string,
    privateKeyBase64: string,
    nome: string,
  ): QrCodeResult {
    // 3 bytes = 6 caracteres hexadecimais
    const ticketId = crypto.randomBytes(3).toString('hex').toUpperCase();
    const qrToken = this.signPayload(eventoId, ticketId, nome, privateKeyBase64);

    return { ticketId, qrToken };
  },
};
