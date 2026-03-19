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

    // 1. Evitar duplicatas no mesmo dia (na fila local)
    if (queue.some(s => s.ticketId === ticketId && s.eventDay === today)) {
        console.log(`ℹ️ Ticket ${ticketId} já está na fila para hoje.`);
        return;
    }

    queue.push({ ticketId, eventDay: today, timestamp: Date.now() });
    this.saveQueue(queue);

    // Adiciona ao histórico local de visibilidade imediata
    this.addToHistory(ticketId);

    // Tente sincronizar apenas se houver 3 ou mais itens na fila (Novo Requisito)
    if (queue.length >= 3) {
        console.log(`📦 Lote com ${queue.length} itens. Iniciando sincronização...`);
        this.processQueue();
    } else {
        console.log(`⏳ Aguardando mais scans para fechar lote (Atual: ${queue.length}/3)`);
    }
  }

  static async processQueue() {
    try {
        const queue = this.getQueue();
        if (queue.length === 0) return { success: true, processed: 0 };

        const token = localStorage.getItem('ALTA_CAFE_JWT');
        if (!token) {
            console.warn('⚠️ Sincronização cancelada: Token ALTA_CAFE_JWT não encontrado no localStorage.');
            return { success: false, error: 'Token ausente' };
        }

        const ticketIds = queue.map(item => item.ticketId);
        console.log(`🚀 Tentando sincronizar lote de ${ticketIds.length} scans...`, ticketIds);

        const response = await fetch(API_ROUTES.SCANS.CHECK_IN_BATCH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ticketIds })
        });

        const rawResult = await response.text();
        
        if (response.ok) {
          try {
              const resData = JSON.parse(rawResult);
              console.log(`✅ Lote processado pelo servidor:`, resData);

              // Limpamos a fila local apenas se o servidor confirmou o recebimento
              // No nosso backend, o bulkCheckIn retorna um objeto com 'processed', 'alreadyScanned', 'errors'
              this.saveQueue([]);
              return { success: true, ...resData };
          } catch (e) {
              console.error('❌ Erro ao processar resposta JSON do servidor:', rawResult);
              return { success: false, error: 'Resposta inválida do servidor' };
          }
        } else {
          console.error(`❌ Falha no envio (Status ${response.status}). Resposta:`, rawResult);
          return { success: false, status: response.status, error: rawResult };
        }
    } catch (err: any) {
        console.error(`❌ Erro crítico de rede/conexão:`, err.message);
        return { success: false, error: err.message };
    }
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
