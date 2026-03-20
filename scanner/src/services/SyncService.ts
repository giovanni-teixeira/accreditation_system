import { API_ROUTES } from '@/config/api';

export interface QueuedScan {
  ticketId: string;
  eventDay: string; // "Mon Mar 18 2024" format
  timestamp: number;
}

class SyncService {
  private static STORAGE_KEY = 'OFFLINE_SCANS_QUEUE';
  private static HISTORY_KEY = 'SCAN_HISTORY_TODAY';

  static enqueueScan(ticketId: string) {
    const queue = this.getQueue();
    const today = new Date().toDateString();

    // 1. Evitar duplicatas na fila local para o mesmo dia
    if (queue.some(s => s.ticketId === ticketId && s.eventDay === today)) {
        console.log(`ℹ️ Ticket ${ticketId} já está na fila para hoje.`);
        return;
    }

    queue.push({ ticketId, eventDay: today, timestamp: Date.now() });
    this.saveQueue(queue);

    // Adiciona ao histórico local de visibilidade imediata
    this.addToHistory(ticketId);

    // Sincronização automática se houver itens
    this.processQueue();
  }

  static async processQueue() {
    try {
        const queue = this.getQueue();
        if (queue.length === 0) return { success: true, processed: 0 };

        const token = localStorage.getItem('ALTA_CAFE_JWT');
        if (!token) {
            console.warn('⚠️ Sincronização cancelada: Token ALTA_CAFE_JWT não encontrado.');
            return { success: false, error: 'Token ausente' };
        }

        const ticketIds = queue.map(item => item.ticketId);
        console.log(`🚀 Sincronizando lote de ${ticketIds.length} scans...`);

        const response = await fetch(API_ROUTES.SCANS.CHECK_IN_BATCH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ticketIds })
        });

        if (response.ok) {
           // Em caso de sucesso do lote, limpamos APENAS o que foi enviado nesta leva
           // Para ser ultra-robusto, poderíamos filtrar por IDs confirmados se o backend suportasse
           // Como o backend bulkCheckIn processa tudo e retorna totais, assumimos sucesso total se 200 OK
           this.saveQueue([]); 
           console.log(`✅ Lote de ${ticketIds.length} enviado com sucesso.`);
           return { success: true };
        } else {
          console.error(`❌ Falha no envio (Status ${response.status})`);
          return { success: false, status: response.status };
        }
    } catch (err: any) {
        console.error(`❌ Erro de rede:`, err.message);
        return { success: false, error: err.message };
    }
  }

  // Iniciar sincronizador automático (chamado uma vez no app)
  static startAutoSync(intervalMs: number = 60000) {
    console.log(`⏰ Auto-sync ativado (${intervalMs/1000}s)`);
    setInterval(() => {
        const queue = this.getQueue();
        if (queue.length > 0) {
            console.log('⏰ Sincronização automática iniciada...');
            this.processQueue();
        }
    }, intervalMs);
  }

  // Ferramenta de Teste Solicitada
  static async generateTestScans(count: number = 10) {
    console.log(`🧪 Gerando ${count} scans de teste para a fila...`);
    const today = new Date().toDateString();
    const currentQueue = this.getQueue();

    for (let i = 0; i < count; i++) {
        const fakeTicketId = `TEST-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        currentQueue.push({
            ticketId: fakeTicketId,
            eventDay: today,
            timestamp: Date.now()
        });
    }

    this.saveQueue(currentQueue);
    return this.processQueue();
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
