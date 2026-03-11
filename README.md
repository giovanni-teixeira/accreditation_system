# APIV Alta Café - Plataforma de Credenciamento

Plataforma profissional e unificada de credenciamento distribuída em microsserviços via Docker Compose e Proxy Reverso Nginx, suportando alta escala, estabilidade de dados e operações _offline-first_ na portaria.

## 🚀 Como Executar na Máquina/VPS

A arquitetura foi desenhada para subir com um único comando, sem interrupções e sem expor portas privadas pra internet.

**1. Certifique-se de que o Motor do Docker (Docker Daemon) está ativo:**
Se estiver no Windows, abra o aplicativo **Docker Desktop** e espere a barrinha verde ("Engine Running"). Se for uma VPS Linux, apenas certifique-se que o pacote principal `docker` e o `docker-compose` estão instalados e ativos.

**2. Compile e Inicie Todos os Serviços (Modo Silencioso - Detached):**
No terminal, logado na pasta principal do projeto raiz (onde o arquivo `docker-compose.yml` reside), rode:
```bash
docker compose up -d --build
```
> O parâmetro `--build` forçará o ecossistema a reempacotar qualquer alteração que você tiver feito recentemente nos Frontends. A primeira vez que esse comando roda ele leva de 2 a 5 minutos, mas nas demais é extremamente rápido.

**3. Para Derrubar o Projeto:**
Se por algum motivo quiser desligar os sistemas (mas manter intacto o Banco de Dados, pois ele tem um volume protetor oculto):
```bash
docker compose down
```

---

## 🌐 Mapeamento Inteligente de Rotas

Quando o comando de subir com sucesso, todo o sistema opera puramente pela Porta Padrão da Web (**80**). Qualquer computador ou celular na mesma rede de Wi-Fi, ou do domínio na internet acessará os painéis pelas rotas abaixo sem menção de portas esquisitas.

### **A) Frontend Principal (Visitantes, Imprensa...)**
- **URL Base:** `http://localhost/` ou `http://<SEU_IP>/`
- Responsável por renderizar a emissão principal da credencial e a exportação para o modal em formato folha A4 em PDF (Público Geral).

### **B) Painel Administrativo Interno**
- **URL Base:** `http://localhost/admin` ou `http://<SEU_IP>/admin`
- É o frontend da pasta `alta_cafe`. Acessar essa URl entregará totalmente o ecossistema da equipe para os administradores, onde os dados de inscritos estarão agrupados.

### **C) Leitor / Scanner da Catraca (PWA)**
- **URL Base:** `http://localhost/scanner` ou `http://<SEU_IP>/scanner`
- É o aplicativo web progressivo de verificação das permissões dos QR Codes com tecnologia Ed25519 offline. Após o login na porta inicial conectada, a equipe da portaria pode embuti-lo na tela inicial do celular sem receios - mesmo se a Internet desabar!

### **D) Gateway de Comunicação da API (NestJS)**
- **URL Base:** `http://localhost/api/` ou `http://<SEU_IP>/api/`
- Todos os endpoints backend estão agrupados magicamente atras do `/api/`. (Ex: Para pegar todos os Usuários em produção, as rotas batem em `/api/auth/` enquanto que para consultar uma credencial o request envia para o backend na rota real de `credenciados/:cpf`).

> As portas cruas (3000, 3001, etc) sequer estão acessíveis ao longo da máquina ou da nuvem, trazendo muito mais segurança pro servidor!
