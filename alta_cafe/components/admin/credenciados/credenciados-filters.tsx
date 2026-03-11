'use client'

import { Search, X, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FiltrosCredenciados, CategoriaCredenciado } from '@/lib/types'
import { ufs, categoriasLabels } from '@/lib/mock-data'

interface CredenciadosFiltersProps {
  filtros: FiltrosCredenciados
  onFiltrosChange: (filtros: FiltrosCredenciados) => void
}

export function CredenciadosFilters({ filtros, onFiltrosChange }: CredenciadosFiltersProps) {
  const handleClear = () => {
    onFiltrosChange({
      busca: '',
      categoria: '',
      uf: '',
    })
  }

  const hasActiveFilters = filtros.busca || filtros.categoria || filtros.uf

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF ou e-mail..."
            value={filtros.busca || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, busca: e.target.value })}
            className="pl-9 border-border bg-card"
          />
        </div>

        {/* Category filter */}
        <Select
          value={filtros.categoria || 'all'}
          onValueChange={(value) => onFiltrosChange({ ...filtros, categoria: value === 'all' ? '' : value as CategoriaCredenciado })}
        >
          <SelectTrigger className="w-[140px] sm:w-[160px] border-border bg-card">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {Object.entries(categoriasLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* UF filter */}
        <Select
          value={filtros.uf || 'all'}
          onValueChange={(value) => onFiltrosChange({ ...filtros, uf: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="w-[100px] sm:w-[120px] border-border bg-card">
            <SelectValue placeholder="UF" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos UFs</SelectItem>
            {ufs.map((uf) => (
              <SelectItem key={uf} value={uf}>{uf}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground">
            <X className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Limpar filtros</span>
          </Button>
        )}
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filtros:</span>
          {filtros.busca && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">Busca: {filtros.busca}</span>}
          {filtros.categoria && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">{categoriasLabels[filtros.categoria]}</span>}
          {filtros.uf && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">{filtros.uf}</span>}
        </div>
      )}
    </div>
  )
}
