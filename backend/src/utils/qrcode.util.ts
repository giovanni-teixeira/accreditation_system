// src/utils/qrcode.util.ts
import * as nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import * as crypto from 'crypto';

export interface QrCodePayload {
  e: string;
  t: string;
  n: string;
}

export interface QrCodeResult {
  ticketId: string;
  qrToken: string;
}

export const QrCodeHelper = {
  generatePayload(
    eventoId: string,
    ticketId: string,
    nome: string,
  ): QrCodePayload {
    return {
      e: eventoId,
      t: ticketId,
      n: nome,
    };
  },

  //Assina um payload e retorna o token formatado.

  signPayload(payload: QrCodePayload, privateKeyBase64: string): string {
    const message = util.decodeUTF8(JSON.stringify(payload));
    const privateKey = util.decodeBase64(privateKeyBase64);
    const signature = nacl.sign.detached(message, privateKey);

    // Formato: payloadBase64.signatureBase64
    return `${util.encodeBase64(message)}.${util.encodeBase64(signature)}`;
  },

  generateSignedToken(
    eventoId: string,
    privateKeyBase64: string,
    nome: string,
  ): QrCodeResult {
    const ticketId = crypto.randomUUID();
    const payload = this.generatePayload(eventoId, ticketId, nome);
    const qrToken = this.signPayload(payload, privateKeyBase64);

    return { ticketId, qrToken };
  },
};
