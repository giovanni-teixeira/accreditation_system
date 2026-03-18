FROM node:22-alpine

WORKDIR /app

# Instalação estratégica de dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código e faz o build
COPY . .
RUN npm run build

# Expõe a porta do Next.js
EXPOSE 3000

# Inicia o servidor de produção
CMD ["npm", "run", "start"]
