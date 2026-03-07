-- CreateTable
CREATE TABLE "Credenciado" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "aceitouLgpd" BOOLEAN NOT NULL DEFAULT false,
    "tipo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cnpj" TEXT,
    "nomeEmpresa" TEXT,
    "siteEmpresa" TEXT,
    "ccir" TEXT,
    "nomePropriedade" TEXT,
    "nomeVeiculo" TEXT,

    CONSTRAINT "Credenciado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credenciado_cpf_key" ON "Credenciado"("cpf");
