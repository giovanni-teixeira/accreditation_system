export interface QrCodeResult {
    ticketId: string;
    qrToken: string;
}
export declare const QrCodeHelper: {
    signPayload(eventoId: string, ticketId: string, nome: string, privateKeyBase64: string): string;
    generateSignedToken(eventoId: string, privateKeyBase64: string, nome: string): QrCodeResult;
};
