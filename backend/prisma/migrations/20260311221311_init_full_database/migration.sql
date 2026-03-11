-- CreateEnum
CREATE TYPE "TipoCategoria" AS ENUM ('EXPOSITOR', 'VISITANTE', 'CAFEICULTOR', 'IMPRENSA', 'ORGANIZACAO', 'TERCEIRIZADO');

-- CreateEnum
CREATE TYPE "PerfilAcesso" AS ENUM ('LEITOR_CATRACA', 'ADMIN');

-- CreateEnum
CREATE TYPE "TipoCombustivel" AS ENUM ('GASOLINA', 'ETANOL', 'DIESEL', 'ELETRICO');

-- CreateTable
CREATE TABLE "evento" (
    "id" UUID NOT NULL,
    "nome_evento" TEXT NOT NULL,
    "is_gratuito" BOOLEAN NOT NULL DEFAULT true,
    "private_key" TEXT,
    "public_key" TEXT,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_organizacao" (
    "id" UUID NOT NULL,
    "login" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil_acesso" "PerfilAcesso" NOT NULL,

    CONSTRAINT "usuario_organizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credenciado" (
    "id" UUID NOT NULL,
    "evento_id" UUID NOT NULL,
    "tipo_categoria" "TipoCategoria" NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cnpj" TEXT,
    "ccir" TEXT,
    "aceite_lgpd" BOOLEAN NOT NULL,
    "tipo_combustivel" "TipoCombustivel" NOT NULL,

    CONSTRAINT "credenciado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" UUID NOT NULL,
    "credenciado_id" UUID NOT NULL,
    "cep" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descarbonizacao" (
    "id" UUID NOT NULL,
    "credenciado_id" UUID NOT NULL,
    "distancia_ida_volta_km" DOUBLE PRECISION NOT NULL,
    "tipo_combustivel" "TipoCombustivel" NOT NULL,

    CONSTRAINT "descarbonizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credencial" (
    "id" UUID NOT NULL,
    "credenciado_id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "qr_token" TEXT NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "print_count" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credencial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qrscans" (
    "id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "scanner_id" TEXT NOT NULL,
    "scan_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qrscans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "evento_nome_evento_key" ON "evento"("nome_evento");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_organizacao_login_key" ON "usuario_organizacao"("login");

-- CreateIndex
CREATE UNIQUE INDEX "credenciado_cpf_key" ON "credenciado"("cpf");

-- CreateIndex
CREATE INDEX "credenciado_evento_id_idx" ON "credenciado"("evento_id");

-- CreateIndex
CREATE INDEX "credenciado_email_idx" ON "credenciado"("email");

-- CreateIndex
CREATE INDEX "credenciado_tipo_categoria_idx" ON "credenciado"("tipo_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "credenciado_evento_id_cpf_key" ON "credenciado"("evento_id", "cpf");

-- CreateIndex
CREATE UNIQUE INDEX "endereco_credenciado_id_key" ON "endereco"("credenciado_id");

-- CreateIndex
CREATE UNIQUE INDEX "descarbonizacao_credenciado_id_key" ON "descarbonizacao"("credenciado_id");

-- CreateIndex
CREATE UNIQUE INDEX "credencial_credenciado_id_key" ON "credencial"("credenciado_id");

-- CreateIndex
CREATE UNIQUE INDEX "credencial_ticket_id_key" ON "credencial"("ticket_id");

-- CreateIndex
CREATE INDEX "credencial_ticket_id_idx" ON "credencial"("ticket_id");

-- CreateIndex
CREATE INDEX "qrscans_ticket_id_idx" ON "qrscans"("ticket_id");

-- AddForeignKey
ALTER TABLE "credenciado" ADD CONSTRAINT "credenciado_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_credenciado_id_fkey" FOREIGN KEY ("credenciado_id") REFERENCES "credenciado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descarbonizacao" ADD CONSTRAINT "descarbonizacao_credenciado_id_fkey" FOREIGN KEY ("credenciado_id") REFERENCES "credenciado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credencial" ADD CONSTRAINT "credencial_credenciado_id_fkey" FOREIGN KEY ("credenciado_id") REFERENCES "credenciado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qrscans" ADD CONSTRAINT "qrscans_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "credencial"("ticket_id") ON DELETE CASCADE ON UPDATE CASCADE;
