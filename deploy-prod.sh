#!/bin/bash
# HAKATON Production Deploy Script - Alta Café
# Executado na VPS para a branch MAIN.

echo "=========================================="
echo "🚀 Iniciando Deploy de PRODUÇÃO (Main)..."
echo "=========================================="

# 1. Atualizar o código-fonte (Já feito pelo GitHub Action, mas garantindo)
echo "📥 1. Sincronizando branch 'main'..."
git fetch origin
git reset --hard origin/main

# 1.5 Gerenciamento do Arquivo de Ambiente (.env) de Produção
echo "🔐 1.5 Configurando variáveis de produção..."
if [ -f "$HOME/alta-cafe-config/prod.env" ]; then
  cp "$HOME/alta-cafe-config/prod.env" "backend/.env"
  echo "✅ Arquivo backend/.env atualizado com prod.env."
elif [ -f "$HOME/alta-cafe-config/.env" ]; then
  cp "$HOME/alta-cafe-config/.env" "backend/.env"
  echo "✅ Arquivo backend/.env atualizado com .env padrão (config)."
elif [ -f "./.env" ]; then
  cp "./.env" "backend/.env"
  echo "✅ Arquivo backend/.env atualizado com .env da raiz do projeto."
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
