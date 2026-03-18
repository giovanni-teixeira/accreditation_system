# Alta Café - Scanner Final (PWA)

Este é o aplicativo oficial de escaneamento de QR Codes para o evento Alta Café. baseada no feedback do usuário. O sistema foi desenvolvido com Next.js e otimizado para funcionar como um PWA (Progressive Web App), permitindo a instalação em dispositivos móveis e operação offline resiliente. baseada no feedback do usuário.

## 🚀 Principais Funcionalidades

- **Validação Offline**: Utiliza criptografia Ed25519 para validar ingressos sem necessidade de conexão constante com a internet. baseada no feedback do usuário.
- **Sincronização em Lote (Batch Sync)**: Arquitetura escalável que acumula leituras e sincroniza com o banco de dados em blocos, reduzindo o tráfego de rede e carga no servidor. baseada no feedback do usuário.
- **Interface Otimizada**: Design imersivo e limpo, focado na velocidade de operação durante o credenciamento. baseada no feedback do usuário.
- **Suporte PWA**: Pode ser instalado na tela inicial do Android e iOS como um aplicativo nativo. baseada no feedback do usuário.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React, Tailwind CSS. baseada no feedback do usuário.
- **Criptografia**: TweetNaCl (Ed25519). baseada no feedback do usuário.
- **Scanner**: HTML5-QRCode. baseada no feedback do usuário.
- **PWA**: Manifest.json e Service Workers integrados ao Next.js. baseada no feedback do usuário.

## 🏃 Como Rodar

1.  Instale as dependências:
    ```bash
    npm install
    ```

2.  Configure as variáveis de ambiente no arquivo `.env.local`:
    ```env
    NEXT_PUBLIC_API_URL=https://sua-api.com
    ```

3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

## 📦 Produção e Instalação

Para gerar a versão de produção e testar o PWA:
```bash
npm run build
npm run start
```
Após rodar, acesse o aplicativo pelo navegador do celular e selecione "Adicionar à Tela de Início". baseada no feedback do usuário.
