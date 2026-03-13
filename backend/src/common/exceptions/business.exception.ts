/**
 * Exceção base para erros de negócio e tempo de execução na aplicação.
 * Extende Error para manter o padrão do Node.js, mas nomeada como RuntimeException
 * conforme solicitado para padronização.
 */
export class RuntimeException extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'RuntimeException';
  }
}

/**
 * Especialização para erros de lógica de negócio.
 */
export class BusinessException extends RuntimeException {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
    this.name = 'BusinessException';
  }
}
