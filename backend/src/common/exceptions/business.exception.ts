export class RuntimeException extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = 'RuntimeException';
  }
}

export class BusinessException extends RuntimeException {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
    this.name = 'BusinessException';
  }
}
