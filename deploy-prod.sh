#!/bin/bash
# HAKATON Production Deploy Script - Alta Café
# Branch: MAIN | Host: 186.249.46.122

echo "=========================================="
echo "🚀 Iniciando Deploy de PRODUÇÃO (Main)..."
echo "=========================================="

# 1. Atualizar o código-fonte
echo "📥 1. Sincronizando branch 'main'..."
git fetch origin
git reset --hard origin/main

# 1.5 Gerenciamento do Arquivo de Ambiente (.env) e SSL
echo "🔐 1.5 Sincronizando Variáveis de Ambiente e SSL..."
if [ -f "./.env" ]; then
  cp "./.env" "backend/.env"
  echo "✅ Arquivo backend/.env atualizado."
elif [ -f "$HOME/alta-cafe-config/.env" ]; then
  cp "$HOME/alta-cafe-config/.env" "backend/.env"
  echo "✅ Arquivo backend/.env atualizado a partir do config global."
fi

# Criar pasta de certificados se não existir
mkdir -p nginx/certs

# Lógica Inteligente de Certificados SSL baseada no feedback do usuário.
REAL_CERT="/etc/letsencrypt/live/credenciamento.altacafe.com.br/fullchain.pem"
REAL_KEY="/etc/letsencrypt/live/credenciamento.altacafe.com.br/privkey.pem"

if [ -f "$REAL_CERT" ] && [ -f "$REAL_KEY" ]; then
  echo "✨ Certificados reais encontrados! Copiando para o diretório do Nginx..."
  cp -L "$REAL_CERT" nginx/certs/fullchain.pem
  cp -L "$REAL_KEY" nginx/certs/privkey.pem
  echo "✅ Certificados oficiais prontos."
elif [ ! -f "nginx/certs/fullchain.pem" ] || [ ! -f "nginx/certs/privkey.pem" ]; then
  echo "⚠️ Certificados reais NÃO encontrados. Criando certificados temporários..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/certs/privkey.pem \
    -out nginx/certs/fullchain.pem \
    -subj "/C=BR/ST=SP/L=Franca/O=AltaCafe/CN=localhost"
  echo "✅ Certificados temporários criados em nginx/certs/."
else
  echo "ℹ️ Usando certificados já existentes em nginx/certs/."
fi

# 2. Derrubando containers
echo "🛑 2. Parando serviços atuais..."
docker compose down

# 3. Reconstruindo e Subindo
echo "🏗️ 3. Construindo e Subindo containers de Produção..."
docker compose up -d --build

# 3.5 Sincronizando Banco de Dados
echo "🗄️ 3.5 Sincronizando Banco de Dados..."
docker exec backend_api npx prisma db push

# 4. Limpeza
echo "🧹 4. Limpando imagens órfãs..."
docker image prune -f

echo "=========================================="
echo "✅ Deploy de PRODUÇÃO Concluído!"
echo "=========================================="
