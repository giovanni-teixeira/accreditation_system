FROM node:22-bookworm-slim

# Instala bibliotecas de sistema necessárias pro Prisma ORM lidar com C++ Engines
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia código e arquivos Prisma
COPY . .

# Gera o client do Prisma para o ambiente linux do container e realiza a Build
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

# Inicia o servidor Node na porta nativa
CMD ["npm", "run", "start:prod"]
