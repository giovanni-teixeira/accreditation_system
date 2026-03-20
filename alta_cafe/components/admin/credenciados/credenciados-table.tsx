'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Eye, 
  Edit, 
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Credenciado, FiltrosCredenciados } from '@/lib/types'
import { 
  categoriasLabels, 
  categoriaColors,
} from '@/lib/mock-data'

interface CredenciadosTableProps {
  credenciados: Credenciado[]
  isLoading?: boolean
  onViewDetails: (credenciado: Credenciado) => void
  onEdit?: (credenciado: Credenciado) => void
  onDelete?: (credenciado: Credenciado) => void
  filtros: FiltrosCredenciados
}

export function CredenciadosTable({ 
  credenciados, 
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
  filtros,
}: CredenciadosTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Filtrar credenciados
  const filteredCredenciados = credenciados.filter((c) => {
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase()
      const matchNome = c.nomeCompleto.toLowerCase().includes(busca)
      const matchCpf = c.cpf.includes(busca)
      const matchEmail = c.email.toLowerCase().includes(busca)
      if (!matchNome && !matchCpf && !matchEmail) return false
    }
    if (filtros.categoria && c.tipoCategoria !== filtros.categoria) return false
    if (filtros.uf && c.uf !== filtros.uf) return false
    return true
  })

  const totalPages = Math.ceil(filteredCredenciados.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCredenciados = filteredCredenciados.slice(startIndex, startIndex + itemsPerPage)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (filteredCredenciados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhum credenciado encontrado</h3>
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          Não encontramos credenciados com os filtros selecionados. Tente ajustar os critérios de busca.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground">Nome</TableHead>
                <TableHead className="font-semibold text-foreground">Categoria</TableHead>
                <TableHead className="hidden font-semibold text-foreground md:table-cell">CPF</TableHead>
                <TableHead className="hidden font-semibold text-foreground lg:table-cell">Celular</TableHead>
                <TableHead className="hidden font-semibold text-foreground xl:table-cell">Município/UF</TableHead>
                <TableHead className="hidden font-semibold text-foreground lg:table-cell">Cadastro</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCredenciados.map((credenciado) => {
                const catColor = categoriaColors[credenciado.tipoCategoria] || { 
                  bg: 'bg-gray-100', 
                  text: 'text-gray-800', 
                  hex: '#888888' 
                }
                return (
                  <TableRow 
                    key={credenciado.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onViewDetails(credenciado)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{credenciado.nomeCompleto}</p>
                        <p className="text-sm text-muted-foreground">{credenciado.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn('font-medium', catColor.bg, catColor.text)}>
                        {categoriasLabels[credenciado.tipoCategoria] || credenciado.tipoCategoria}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden font-mono text-sm md:table-cell">
                      {credenciado.cpf}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {credenciado.celular}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {credenciado.municipio}/{credenciado.uf}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {format(new Date(credenciado.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(credenciado)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          {/* 
                          <DropdownMenuItem onClick={() => onEdit?.(credenciado)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem> 
                          */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => onDelete?.(credenciado)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCredenciados.length)} de {filteredCredenciados.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Anterior</span>
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentPage}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline mr-1">Próximo</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
