"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessException = exports.RuntimeException = void 0;
class RuntimeException extends Error {
    message;
    statusCode;
    constructor(message, statusCode = 400) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = 'RuntimeException';
    }
}
exports.RuntimeException = RuntimeException;
class BusinessException extends RuntimeException {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
        this.name = 'BusinessException';
    }
}
exports.BusinessException = BusinessException;
//# sourceMappingURL=business.exception.js.map