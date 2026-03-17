// src/interfaces/qr-scan.interface.ts
export interface IQrScan {
  id: string;
  ticketId: string;
  scannerId: string;
  scanType: string;
  createdAt: Date;
}
