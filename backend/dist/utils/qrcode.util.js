"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeHelper = void 0;
const nacl = __importStar(require("tweetnacl"));
const util = __importStar(require("tweetnacl-util"));
const crypto = __importStar(require("crypto"));
exports.QrCodeHelper = {
    generatePayload(eventoId, ticketId, nome) {
        return {
            e: eventoId,
            t: ticketId,
            n: nome,
        };
    },
    signPayload(payload, privateKeyBase64) {
        const message = util.decodeUTF8(JSON.stringify(payload));
        const privateKey = util.decodeBase64(privateKeyBase64);
        const signature = nacl.sign.detached(message, privateKey);
        return `${util.encodeBase64(message)}.${util.encodeBase64(signature)}`;
    },
    generateSignedToken(eventoId, privateKeyBase64, nome) {
        const ticketId = crypto.randomUUID();
        const payload = this.generatePayload(eventoId, ticketId, nome);
        const qrToken = this.signPayload(payload, privateKeyBase64);
        return { ticketId, qrToken };
    },
};
//# sourceMappingURL=qrcode.util.js.map