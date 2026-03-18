import { API_ROUTES } from '@/config/api';

export interface QueuedScan {
  ticketId: string;
  timestamp: number;
}

class SyncService {
  private static STORAGE_KEY = 'OFFLINE_SCANS_QUEUE';
  private static HISTORY_KEY = 'SCAN_HISTORY_TODAY';

  static enqueueScan(ticketId: string) {
    const queue = this.getQueue();


    if (queue.some(s => s.ticketId === ticketId)) return;

    queue.push({ ticketId, timestamp: Date.now() });
    this.saveQueue(queue);

    this.addToHistory(ticketId);


    if (queue.length >= 10) {
      this.processQueue();
    }
  }



  static async processQueue() {
    try {
        const queue = this.getQueue();
        if (queue.length === 0) return;

        const token = localStorage.getItem('ALTA_CAFE_JWT');
        if (!token) return;

        const ticketIds = queue.map(item => item.ticketId);

        console.log(`🔥 Sincronizando LOTE de ${ticketIds.length} scans...`);

        const response = await fetch(API_ROUTES.SCANS.CHECK_IN_BATCH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ticketIds })
        });

        if (response.ok) {
          const resData = await response.json();
          console.log(`✅ Lote sincronizado com sucesso:`, resData);

          this.saveQueue([]);
        } else {
          console.warn(`⚠️ Falha ao sincronizar lote (Status ${response.status})`);
        }
    } catch (err) {
        console.error(`❌ Erro crítico de conexão ao sincronizar lote:`, err);
    }
  }

  static isAlreadyScannedToday(ticketId: string): boolean {
    const history = this.getHistory();
    const today = new Date().toDateString();
    return history[today]?.includes(ticketId) || false;
  }

  private static getQueue(): QueuedScan[] {
    try {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  private static saveQueue(queue: QueuedScan[]) {
    try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
    } catch (err) {
        console.error('Erro no localStorage (Queue):', err);
    }
  }

  private static getHistory(): Record<string, string[]> {
    try {
        if (typeof window === 'undefined') return {};
        const data = localStorage.getItem(this.HISTORY_KEY);
        return data ? JSON.parse(data) : {};
    } catch { return {}; }
  }

  private static addToHistory(ticketId: string) {
    try {
        const history = this.getHistory();
        const today = new Date().toDateString();

        if (!history[today]) history[today] = [];
        if (!history[today].includes(ticketId)) history[today].push(ticketId);

        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (err) {
        console.error('Erro no localStorage (History):', err);
    }
  }
}

export default SyncService;
