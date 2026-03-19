'use client'

import { useState, useEffect } from 'react'
import { UserPlus, Download, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CredenciadosTable } from '@/components/admin/credenciados/credenciados-table'
import { CredenciadosFilters } from '@/components/admin/credenciados/credenciados-filters'
import { CredenciadoDrawer } from '@/components/admin/credenciados/credenciado-drawer'
import { categoriasLabels } from '@/lib/mock-data'
import { credenciadosService, ICredenciado } from '@/lib/api.service'
import type { Credenciado, FiltrosCredenciados } from '@/lib/types'
import { toast } from 'sonner'

// Converte ICredenciado da API para o tipo Credenciado dos componentes
function mapApiToCredenciado(c: ICredenciado): Credenciado {
  return {
    id: c.id,
    eventoId: c.eventoId,
    tipoCategoria: c.tipoCategoria as any,
    nomeCompleto: c.nomeCompleto,
    cpf: c.cpf,
    rg: c.rg,
    celular: c.celular,
    email: c.email,
    aceiteLgpd: c.aceiteLgpd,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    cnpj: c.cnpj,
    ccir: c.ccir,
    // Endereço aninhado
    rua: c.endereco?.rua,
    municipio: c.endereco?.cidade ?? '',
    uf: c.endereco?.estado ?? '',
    // Empresa via nomeEmpresa
    empresa: c.nomeEmpresa,
    cargo: undefined,
    // Descarbonização
    cidadeOrigem: undefined,
    estadoOrigem: undefined,
    distanciaKm: c.descarbonizacao
      ? c.descarbonizacao.distanciaIdaVoltaKm / 2
      : undefined,
    meioTransporte: undefined,
  }
}

export default function CredenciadosPage() {
  const [credenciados, setCredenciados] = useState<Credenciado[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filtros, setFiltros] = useState<FiltrosCredenciados>({
    busca: '',
    categoria: '',
    uf: '',
  })
  const [selectedCredenciado, setSelectedCredenciado] = useState<Credenciado | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    credenciadosService.listar()
      .then((data) => setCredenciados(data.map(mapApiToCredenciado)))
      .catch(() => toast.error('Erro ao carregar credenciados.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleViewDetails = (credenciado: Credenciado) => {
    setSelectedCredenciado(credenciado)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedCredenciado(null), 300)
  }

  const handleDelete = async (credenciado: Credenciado) => {
    if (!confirm(`Tem certeza que deseja excluir ${credenciado.nomeCompleto}?`)) return
    try {
      await credenciadosService.deletar(credenciado.id)
      setCredenciados(prev => prev.filter(c => c.id !== credenciado.id))
      toast.success('Credenciado excluído com sucesso!')
    } catch {
      toast.error('Erro ao excluir credenciado.')
    }
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'CPF', 'Email', 'Celular', 'Categoria', 'Empresa', 'Município', 'UF', 'Data Cadastro']

    const filteredData = credenciados.filter((c) => {
      if (filtros.busca) {
        const busca = filtros.busca.toLowerCase()
        const match = c.nomeCompleto.toLowerCase().includes(busca)
          || c.cpf.includes(busca)
          || c.email.toLowerCase().includes(busca)
        if (!match) return false
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
      categoriasLabels[c.tipoCategoria] ?? c.tipoCategoria,
      c.empresa ?? '',
      c.municipio,
      c.uf,
      new Date(c.createdAt).toLocaleDateString('pt-BR'),
    ])

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';')),
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `credenciados_alta_cafe_2026_${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    toast.success('Arquivo CSV exportado com sucesso!')
  }

  const filteredCount = credenciados.filter((c) => {
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase()
      const match = c.nomeCompleto.toLowerCase().includes(busca)
        || c.cpf.includes(busca)
        || c.email.toLowerCase().includes(busca)
      if (!match) return false
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
          <p className="text-muted-foreground">Gerencie os credenciamentos do evento</p>
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
        isLoading={isLoading}
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