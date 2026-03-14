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

# 1.5 Gerenciamento do Arquivo de Ambiente (.env) e Nginx baseada no feedback do usuário.
echo "🔐 1.5 Preparando configurações de ambiente..."
if [ -f "./.env" ]; then
  cp "./.env" "backend/.env"
  echo "✅ Arquivo backend/.env atualizado."
elif [ -f "$HOME/alta-cafe-config/.env" ]; then
  cp "$HOME/alta-cafe-config/.env" "backend/.env"
  echo "✅ Arquivo backend/.env atualizado a partir do config global."
fi

# Configura o Nginx para Produção (Com SSL) baseada no feedback do usuário.
if [ -f "nginx/nginx.prod.conf" ]; then
  cp nginx/nginx.prod.conf nginx/nginx.conf
  echo "✅ Nginx configurado para AMBIENTE PROD (HTTPS)."
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
