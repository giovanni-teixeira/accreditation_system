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

# Se os certificados SSL não existirem, cria dummies para o Nginx não crashar
if [ ! -f "nginx/certs/fullchain.pem" ] || [ ! -f "nginx/certs/privkey.pem" ]; then
  echo "⚠️ Certificados SSL reais não encontrados. Criando certificados temporários para evitar crash do Nginx..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/certs/privkey.pem \
    -out nginx/certs/fullchain.pem \
    -subj "/C=BR/ST=SP/L=Franca/O=AltaCafe/CN=localhost"
  echo "✅ Certificados temporários criados em nginx/certs/."
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
