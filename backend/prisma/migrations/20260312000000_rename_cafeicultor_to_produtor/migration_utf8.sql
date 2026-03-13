-- AlterEnum
BEGIN;
CREATE TYPE "TipoCategoria_new" AS ENUM ('EXPOSITOR', 'VISITANTE', 'PRODUTOR', 'IMPRENSA', 'ORGANIZACAO', 'TERCEIRIZADO');
ALTER TABLE "credenciado" ALTER COLUMN "tipo_categoria" TYPE "TipoCategoria_new" USING ("tipo_categoria"::text::"TipoCategoria_new");
ALTER TYPE "TipoCategoria" RENAME TO "TipoCategoria_old";
ALTER TYPE "TipoCategoria_new" RENAME TO "TipoCategoria";
DROP TYPE "TipoCategoria_old";
COMMIT;

-- AlterTable
ALTER TABLE "credenciado" ADD COLUMN     "nome_empresa" TEXT,
ADD COLUMN     "site_empresa" TEXT;

