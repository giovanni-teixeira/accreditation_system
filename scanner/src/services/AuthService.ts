import { API_ROUTES } from '@/config/api';

export interface LoginResponse {
    access_token: string;
    publicKey: string;
}

export class AuthService {
    private static STORAGE_KEY_TOKEN = 'ALTA_CAFE_JWT';
    private static STORAGE_KEY_PUBKEY = 'ALTA_CAFE_PUBLIC_KEY';

    static async login(login: string, senhaHash: string): Promise<LoginResponse> {
        const response = await fetch(API_ROUTES.AUTH.LOGIN_PORTARIA, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, senhaHash })
        });

        if (!response.ok) {
            throw new Error('Credenciais inválidas');
        }

        const data = await response.json();

        if (!data.publicKey) {
            throw new Error('Usuário sem permissão de portaria ou chave não encontrada.');
        }

        this.saveSession(data.access_token, data.publicKey);

        return data;
    }

    private static saveSession(token: string, publicKey: string) {
        localStorage.setItem(this.STORAGE_KEY_TOKEN, token);
        localStorage.setItem(this.STORAGE_KEY_PUBKEY, publicKey);
    }

    static logout(): void {
        localStorage.removeItem(this.STORAGE_KEY_TOKEN);
        localStorage.removeItem(this.STORAGE_KEY_PUBKEY);
    }

    static getSession() {
        if (typeof window === 'undefined') return { token: null, publicKey: null };

        return {
            token: localStorage.getItem(this.STORAGE_KEY_TOKEN),
            publicKey: localStorage.getItem(this.STORAGE_KEY_PUBKEY)
        };
    }

    static isLoggedIn(): boolean {
        const { token, publicKey } = this.getSession();
        return !!(token && publicKey);
    }
}
