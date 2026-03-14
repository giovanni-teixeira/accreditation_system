#!/bin/bash
# HAKATON Deploy CI/CD Script - Alta Café
# Executado na VPS para forçar atualização do Github e Rebuild dos Containers.

echo "=========================================="
echo "🚀 Iniciando Deploy Automatizado..."
echo "=========================================="

# 1. Atualizar o código-fonte
echo "📥 1. Puxando alterações do GitHub (Branch 'dev')..."
git fetch origin
git reset --hard origin/dev
git pull origin dev

# 1.5 Gerenciamento do Arquivo de Ambiente (.env) e Nginx baseada no feedback do usuário.
echo "🔐 1.5 Preparando configurações de ambiente..."
if [ -f "$HOME/alta-cafe-config/.env" ]; then
  cp "$HOME/alta-cafe-config/.env" "backend/.env"
  echo "✅ Arquivo backend/.env atualizado."
fi

# Configura o Nginx para Desenvolvimento (Sem SSL) baseada no feedback do usuário.
if [ -f "nginx/nginx.dev.conf" ]; then
  cp nginx/nginx.dev.conf nginx/nginx.conf
  echo "✅ Nginx configurado para AMBIENTE DEV (HTTP)."
fi


# 2. Derrubando containers (Preservando Volumes de Dados)
echo "🛑 2. Parando serviços atuais..."
docker compose down

# 3. Reconstruindo e Subindo
echo "🏗️ 3. Reconstruindo imagens das aplicações alteradas e Subindo arquitetura..."
docker compose up -d --build

# 3.5 Sincronizando Banco de Dados (Migrações)
echo "🗄️ 3.5 Estruturando e Sincronizando o Banco de Dados com Prisma..."
docker exec backend_api npx prisma db push

# 4. Limpeza de Imagens Órfãs
echo "🧹 4. Limpando cache do Docker antigo..."
docker image prune -f

echo "=========================================="
echo "✅ Deploy Concluído com Sucesso!"
echo "O Nginx e todas as aplicações já estão roteando na porta 80."
echo "=========================================="
