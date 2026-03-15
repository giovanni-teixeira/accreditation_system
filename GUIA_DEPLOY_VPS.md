# 🚀 GUIA DE DEPLOY E MIGRAÇÃO - VPS (HAKATON)

Este documento contém os comandos essenciais para subir o projeto na VPS e garantir que o banco de dados seja reestruturado corretamente com os IDs de 5 caracteres. baseada no feedback do usuário.

## 1. Subir os Containers baseada no feedback do usuário.
Na raiz do projeto, execute: baseada no feedback do usuário.
```bash
docker compose build --no-cache
docker compose up -d
```

### 🔄 Rebuild sem Parar Tudo (Sem `down`) baseada no feedback do usuário.
Para atualizar o código sem derrubar o banco de dados ou outros serviços:
```bash
docker compose up --build -d
```
*Este comando reconstrói apenas o que mudou e reinicia os containers necessários sem precisar do `down`.* baseada no feedback do usuário.

---

## 2. Criar a Função de IDs no PostgreSQL baseada no feedback do usuário.
Como o banco na VPS estará vazio ou precisará da função SQL, execute este comando para injetar a lógica de geração de IDs de 5 caracteres: baseada no feedback do usuário.

```bash
docker exec -i postgres_db psql -U postgres -d alta_cafe -c "CREATE OR REPLACE FUNCTION generate_short_id() RETURNS text AS \$\$ DECLARE chars text := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; result text := ''; i integer := 0; BEGIN FOR i IN 1..5 LOOP result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1); END LOOP; RETURN result; END; \$\$ LANGUAGE plpgsql;"
```

---

## 3. Sincronizar o Banco (Prisma) baseada no feedback do usuário.
Este comando vai aplicar o novo `schema.prisma` e criar as tabelas com os campos de IDs alfanuméricos e timestamps. baseada no feedback do usuário.

**⚠️ AVISO: Isso apagará os dados existentes no banco para aplicar a nova estrutura de IDs.** baseada no feedback do usuário.

```bash
docker exec -i backend_api npx prisma db push --accept-data-loss
```

---

## 4. Gerar o Cliente Prisma baseada no feedback do usuário.
Garanta que o código do backend entenda o novo schema: baseada no feedback do usuário.
```bash
docker exec -i backend_api npx prisma generate
```

---

## 5. Comandos Úteis (Troubleshooting) baseada no feedback do usuário.

### Ver Logs baseada no feedback do usuário.
```bash
docker compose logs -f backend_api
```

### Reiniciar Serviço Específico baseada no feedback do usuário.
```bash
docker compose restart backend_api
```

### Entrar no Banco via Terminal baseada no feedback do usuário.
```bash
docker exec -it postgres_db psql -U postgres -d alta_cafe
```

---
**Importante:** Este arquivo está no `.gitignore` e não será enviado para o repositório. baseada no feedback do usuário. Guarde-o para referência durante o deploy! baseada no feedback do usuário. 🦾🔥
