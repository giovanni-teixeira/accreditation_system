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

# 1.5 Gerenciamento do Arquivo de Ambiente (.env) e SSL
echo "🔐 1.5 Preparando variáveis de ambiente e certificados..."
if [ -f "$HOME/alta-cafe-config/.env" ]; then
  cp "$HOME/alta-cafe-config/.env" "backend/.env"
  echo "✅ Arquivo backend/.env atualizado."
fi

# Criar pasta de certificados se não existir
mkdir -p nginx/certs

# Lógica Inteligente de Certificados SSL baseada no feedback do usuário.
REAL_CERT="/etc/letsencrypt/live/credenciamento.altacafe.com.br/fullchain.pem"
REAL_KEY="/etc/letsencrypt/live/credenciamento.altacafe.com.br/privkey.pem"

if [ -f "$REAL_CERT" ] && [ -f "$REAL_KEY" ]; then
  echo "✨ Certificados reais encontrados! Copiando para o diretório do Nginx..."
  # Usamos -L para seguir os links simbólicos do Let's Encrypt baseada no feedback do usuário.
  cp -L "$REAL_CERT" nginx/certs/fullchain.pem
  cp -L "$REAL_KEY" nginx/certs/privkey.pem
  echo "✅ Certificados oficiais prontos."
elif [ ! -f "nginx/certs/fullchain.pem" ] || [ ! -f "nginx/certs/privkey.pem" ]; then
  echo "⚠️ Certificados reais NÃO encontrados em $REAL_CERT. Criando certificados temporários..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/certs/privkey.pem \
    -out nginx/certs/fullchain.pem \
    -subj "/C=BR/ST=SP/L=Franca/O=AltaCafe/CN=localhost"
  echo "✅ Certificados temporários criados em nginx/certs/."
else
  echo "ℹ️ Usando certificados já existentes em nginx/certs/."
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
