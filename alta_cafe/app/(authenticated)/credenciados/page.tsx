'use client'

import { useState } from 'react'
import { UserPlus, Download, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CredenciadosTable } from '@/components/admin/credenciados/credenciados-table'
import { CredenciadosFilters } from '@/components/admin/credenciados/credenciados-filters'
import { CredenciadoDrawer } from '@/components/admin/credenciados/credenciado-drawer'
import { credenciados as credenciadosIniciais, categoriasLabels } from '@/lib/mock-data'
import type { Credenciado, FiltrosCredenciados } from '@/lib/types'
import { toast } from 'sonner'

export default function CredenciadosPage() {
  const [credenciados, setCredenciados] = useState<Credenciado[]>(credenciadosIniciais)
  const [filtros, setFiltros] = useState<FiltrosCredenciados>({
    busca: '',
    categoria: '',
    uf: '',
  })
  const [selectedCredenciado, setSelectedCredenciado] = useState<Credenciado | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleViewDetails = (credenciado: Credenciado) => {
    setSelectedCredenciado(credenciado)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedCredenciado(null), 300)
  }

  const handleDelete = (credenciado: Credenciado) => {
    if (confirm(`Tem certeza que deseja excluir ${credenciado.nomeCompleto}?`)) {
      setCredenciados(prev => prev.filter(c => c.id !== credenciado.id))
      toast.success('Credenciado excluído com sucesso!')
    }
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'CPF', 'Email', 'Celular', 'Categoria', 'Empresa', 'Cargo', 'Município', 'UF', 'Data Cadastro']
    const filteredData = credenciados.filter((c) => {
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

    const rows = filteredData.map(c => [
      c.id,
      c.nomeCompleto,
      c.cpf,
      c.email,
      c.celular,
      categoriasLabels[c.tipoCategoria],
      c.empresa || '',
      c.cargo || '',
      c.municipio,
      c.uf,
      new Date(c.createdAt).toLocaleDateString('pt-BR')
    ])

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `credenciados_alta_cafe_2026_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast.success('Arquivo CSV exportado com sucesso!')
  }

  // Contar credenciados filtrados
  const filteredCount = credenciados.filter((c) => {
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
  }).length

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Credenciados</h1>
          <p className="text-muted-foreground">
            Gerencie os credenciamentos do evento
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span> CSV
          </Button>
          <Button size="sm" asChild>
            <Link href="/credenciados/novo">
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Novo</span> Credenciamento
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total de registros</p>
          <p className="text-xl font-bold text-foreground">{filteredCount.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Filters */}
      <CredenciadosFilters filtros={filtros} onFiltrosChange={setFiltros} />

      {/* Table */}
      <CredenciadosTable
        credenciados={credenciados}
        filtros={filtros}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
      />

      {/* Details drawer */}
      <CredenciadoDrawer
        credenciado={selectedCredenciado}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  )
}
