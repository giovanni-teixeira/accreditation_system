// verify_qrcode.ts
import * as nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import * as crypto from 'crypto';

const QrCodeHelper = {
  signPayload(eventoId: string, ticketId: string, privateKeyBase64: string) {
    const messageStr = `${eventoId}|${ticketId}`;
    const message = util.decodeUTF8(messageStr);
    const privateKey = util.decodeBase64(privateKeyBase64);
    const signature = nacl.sign.detached(message, privateKey);
    return `${messageStr}.${util.encodeBase64(signature)}`;
  }
};

// Teste
const keyPair = nacl.sign.keyPair();
const publicKeyBase64 = util.encodeBase64(keyPair.publicKey);
const privateKeyBase64 = util.encodeBase64(keyPair.secretKey);

const eventoId = 'EVENTO_TESTE';
const ticketId = crypto.randomBytes(5).toString('hex').toUpperCase();

console.log('--- TESTE DE OTIMIZAÇÃO DE QR CODE ---');
console.log('Ticket ID (10 chars):', ticketId);

const qrToken = QrCodeHelper.signPayload(eventoId, ticketId, privateKeyBase64);
console.log('QR Token Final:', qrToken);

// Simulação do Scanner
const parts = qrToken.split('.');
const payloadRaw = parts[0];
const signatureBase64 = parts[1];

const messageUint8 = util.decodeUTF8(payloadRaw);
const signatureUint8 = util.decodeBase64(signatureBase64);
const publicKeyUint8 = util.decodeBase64(publicKeyBase64);

const isValid = nacl.sign.detached.verify(messageUint8, signatureUint8, publicKeyUint8);
console.log('Validação Scanner Offline:', isValid ? '✅ SUCESSO' : '❌ FALHA');

const [scanEventoId, scanTicketId] = payloadRaw.split('|');
console.log('Dados Extraídos:', { scanEventoId, scanTicketId });

if (isValid && scanTicketId === ticketId) {
  process.exit(0);
} else {
  process.exit(1);
}
