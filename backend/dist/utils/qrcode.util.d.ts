export interface QrCodePayload {
    e: string;
    t: string;
    n: string;
}
export interface QrCodeResult {
    ticketId: string;
    qrToken: string;
}
export declare const QrCodeHelper: {
    generatePayload(eventoId: string, ticketId: string, nome: string): QrCodePayload;
    signPayload(payload: QrCodePayload, privateKeyBase64: string): string;
    generateSignedToken(eventoId: string, privateKeyBase64: string, nome: string): QrCodeResult;
};
