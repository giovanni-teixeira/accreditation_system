'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import nacl from 'tweetnacl';
import util from 'tweetnacl-util';
import { API_ROUTES } from '@/config/api';

export default function Scanner() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', senha: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [scanResult, setScanResult] = useState<{ status: 'IDLE' | 'SUCCESS' | 'ERROR', message: string, detailed?: string }>({ status: 'IDLE', message: 'Aguardando Leitura...' });
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const lastScan = useRef<number>(0);

  useEffect(() => {
    // Checa sessão ao carregar
    const token = localStorage.getItem('ALTA_CAFE_JWT');
    const key = localStorage.getItem('ALTA_CAFE_PUBLIC_KEY');
    if (token && key) {
      setPublicKey(key);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      // Requisição centralizada pro Proxy Nginx `/api/...` burlando Ngrok Domains
      const response = await fetch(API_ROUTES.AUTH.LOGIN_PORTARIA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginForm.login, senhaHash: loginForm.senha })
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();

      if (!data.publicKey) {
        throw new Error('Usuário sem permissão de portaria ou chave não encontrada no evento.');
      }

      localStorage.setItem('ALTA_CAFE_JWT', data.access_token);
      localStorage.setItem('ALTA_CAFE_PUBLIC_KEY', data.publicKey);

      setPublicKey(data.publicKey);
      setIsLoggedIn(true);
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    stopScanner();
    localStorage.removeItem('ALTA_CAFE_JWT');
    localStorage.removeItem('ALTA_CAFE_PUBLIC_KEY');
    setIsLoggedIn(false);
    setPublicKey('');
  };

  const startScanner = () => {
    if (!publicKey) return;

    setIsScanning(true);
    setScanResult({ status: 'IDLE', message: 'Aguardando Leitura...' });

    setTimeout(() => {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
    setIsScanning(false);
  };

  const onScanSuccess = (decodedText: string) => {
    // Evita ler novamente em menos de 2 segundos para dar tempo visual ao porteiro
    if (Date.now() - lastScan.current < 2000) return;
    lastScan.current = Date.now();

    try {
      const parts = decodedText.split('.');
      if (parts.length !== 2) throw new Error('Token adulterado (formato inválido)');

      const payloadRaw = parts[0]; // Formato: eventoId|ticketId
      const signatureBase64 = parts[1];

      // Verificação Assinatura Ed25519 offline
      const messageUint8 = util.decodeUTF8(payloadRaw);
      const signatureUint8 = util.decodeBase64(signatureBase64);
      const publicKeyUint8 = util.decodeBase64(publicKey);

      const isValid = nacl.sign.detached.verify(messageUint8, signatureUint8, publicKeyUint8);

      if (!isValid) {
        setScanResult({ status: 'ERROR', message: 'Assinatura Inválida', detailed: 'O QR Code foi adulterado ou pertence a outro evento.' });
        return;
      }

      stopScanner();

      // No novo formato, o payload é "eventoId|ticketId|nome"
      const [eventoId, ticketId, nome] = payloadRaw.split('|');

      setScanResult({
        status: 'SUCCESS',
        message: 'Acesso Liberado!',
        detailed: `Nome: ${nome || 'Não informado'}\nTicket: ${ticketId}\nEvento: ${eventoId}`
      });

    } catch (err: any) {
      console.error('Erro Nacl Decode:', err);
      setScanResult({ status: 'ERROR', message: 'Credencial Inválida', detailed: err.message || 'Dados corrompidos ou ilegíveis.' });
    }
  };

  const onScanFailure = (err: any) => {
    // ignorar falhas silenciosas
  };

  // --- TELA DE LOGIN ---
  if (!isLoggedIn) {
    return (
      <div style={{ fontFamily: 'Arial', maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#5D4037', marginBottom: '10px' }}>Alta Café</h1>
        <p style={{ color: '#777', marginBottom: '30px' }}>Acesso à Portaria Offline</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {loginError && <div style={{ color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '8px', fontSize: '14px' }}>{loginError}</div>}

          <input
            type="text"
            placeholder="Usuário"
            required
            value={loginForm.login}
            onChange={e => setLoginForm({ ...loginForm, login: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
          />
          <input
            type="password"
            placeholder="Senha"
            required
            value={loginForm.senha}
            onChange={e => setLoginForm({ ...loginForm, senha: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{ padding: '15px', background: '#5D4037', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: isLoading ? 'wait' : 'pointer' }}>
            {isLoading ? 'Conectando...' : 'Entrar no Scanner'}
          </button>
        </form>
      </div>
    );
  }

  // --- TELA PRINCIPAL (SCANNER OFFLINE) ---
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#5D4037', margin: 0 }}>Alta Café - Portaria</h1>
        <button onClick={handleLogout} style={{ padding: '8px 12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Sair</button>
      </div>
      <p style={{ color: '#777', marginTop: '5px' }}>Validação 100% Offline (Ed25519)</p>

      {/* RESULTADO */}
      {scanResult.status !== 'IDLE' && (
        <div style={{
          marginTop: '20px',
          padding: '30px',
          borderRadius: '16px',
          backgroundColor: scanResult.status === 'SUCCESS' ? '#e8f5e9' : '#ffebee',
          color: scanResult.status === 'SUCCESS' ? '#2e7d32' : '#c62828',
          border: `2px solid ${scanResult.status === 'SUCCESS' ? '#2e7d32' : '#c62828'}`
        }}>
          <h2>{scanResult.message}</h2>
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '8px' }}>
            {scanResult.detailed}
          </pre>
          <button
            onClick={() => { setScanResult({ status: 'IDLE', message: 'Pronto' }); startScanner(); }}
            style={{ marginTop: '15px', padding: '10px 20px', fontSize: '16px', background: '#5D4037', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Escanear Próximo
          </button>
        </div>
      )}

      {/* CÂMERA */}
      {isScanning ? (
        <div style={{ marginTop: '30px' }}>
          <div id="qr-reader" style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}></div>
          <button onClick={stopScanner} style={{ marginTop: '20px', padding: '10px', background: '#ccc', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Cancelar</button>
        </div>
      ) : (
        scanResult.status === 'IDLE' && (
          <button
            onClick={startScanner}
            style={{ marginTop: '30px', padding: '20px', fontSize: '20px', background: '#388E3C', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', width: '100%' }}>
            📸 INICIAR SCANNER
          </button>
        )
      )}
    </div>
  );
}
