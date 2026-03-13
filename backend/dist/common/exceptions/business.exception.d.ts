export declare class RuntimeException extends Error {
    message: string;
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare class BusinessException extends RuntimeException {
    constructor(message: string, statusCode?: number);
}
