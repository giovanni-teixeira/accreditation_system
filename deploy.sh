#!/bin/bash
# HAKATON Deploy CI/CD Script - Alta Café
# Executado na VPS para forçar atualização do Github e Rebuild dos Containers.

echo "=========================================="
echo "🚀 Iniciando Deploy Automatizado..."
echo "=========================================="

# 1. Atualizar o código-fonte
echo "📥 1. Puxando alterações do GitHub (Branch 'dev-backend-endereco')..."
git fetch origin
git reset --hard origin/dev-backend-endereco
git pull origin dev-backend-endereco

# 1.5 Gerenciamento do Arquivo de Ambiente (.env) seguro
echo "🔐 1.5 Copiando Variáveis de Ambiente (.env) seguras do servidor..."
if [ -f "$HOME/alta-cafe-config/.env" ]; then
  cp "$HOME/alta-cafe-config/.env" "backend/.env"
  echo "✅ Arquivo backend/.env atualizado com sucesso a partir de $HOME/alta-cafe-config/.env."
else
  echo "⚠️ AVISO: Arquivo $HOME/alta-cafe-config/.env não encontrado no servidor! A aplicação pode falhar ao conectar no banco."
fi


# 2. Derrubando containers (Preservando Volumes de Dados)
echo "🛑 2. Parando serviços atuais..."
docker compose down

# 3. Reconstruindo e Subindo
echo "🏗️ 3. Reconstruindo imagens das aplicações alteradas e Subindo arquitetura..."
docker compose up -d --build

# 4. Limpeza de Imagens Órfãs
echo "🧹 4. Limpando cache do Docker antigo..."
docker image prune -f

echo "=========================================="
echo "✅ Deploy Concluído com Sucesso!"
echo "O Nginx e todas as aplicações já estão roteando na porta 80."
echo "=========================================="
