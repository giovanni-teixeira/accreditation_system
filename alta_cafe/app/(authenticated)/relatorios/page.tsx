'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  BarChart3,
  Download,
  FileText,
  Users,
  MapPin,
  Percent,
  Calendar,
  TrendingUp,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { credenciadosService, ICredenciado, TipoCategoria } from '@/lib/api.service'

// ─── Cores e labels por categoria ────────────────────────────────────────────
const categoriaConfig: Record<string, { label: string; color: string }> = {
  [TipoCategoria.EXPOSITOR]:   { label: 'Expositores',             color: '#0000FF' },
  [TipoCategoria.PRODUTOR]:    { label: 'Produtores',              color: '#00CC00' },
  [TipoCategoria.VISITANTE]:   { label: 'Visitantes',              color: '#8B008B' },
  [TipoCategoria.IMPRENSA]:    { label: 'Imprensa',                color: '#778899' },
  [TipoCategoria.ORGANIZACAO]: { label: 'Comissão Organizadora',   color: '#1a5c2a' },
  [TipoCategoria.TERCEIRIZADO]:{ label: 'Colaborador Terceirizado',color: '#7b3f00' },
}

// ─── Helper: agrupar credenciados por dia ─────────────────────────────────────
function agruparPorDia(credenciados: ICredenciado[], dias: number) {
  const hoje = new Date()
  const mapa: Record<string, number> = {}

  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoje)
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    mapa[key] = 0
  }

  credenciados.forEach((c) => {
    const d = new Date(c.createdAt)
    const diffDias = Math.floor((hoje.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDias < dias) {
      const key = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      mapa[key] = (mapa[key] ?? 0) + 1
    }
  })

  return Object.entries(mapa).map(([dia, credenciados]) => ({ dia, credenciados }))
}

// ─── Helper: exportar CSV ─────────────────────────────────────────────────────
function exportCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const content = [
    headers.join(';'),
    ...rows.map(r => r.map(c => `"${c}"`).join(';')),
  ].join('\n')
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function RelatoriosPage() {
  const [credenciados, setCredenciados] = useState<ICredenciado[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [periodo, setPeriodo] = useState('7d')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')

  useEffect(() => {
    credenciadosService.listar()
      .then(setCredenciados)
      .catch(() => toast.error('Erro ao carregar dados.'))
      .finally(() => setIsLoading(false))
  }, [])

  // ── Filtrar por período ──────────────────────────────────────────────────
  const diasPeriodo = periodo === '7d' ? 7 : periodo === '15d' ? 15 : periodo === '30d' ? 30 : 99999

  const dadosFiltrados = useMemo(() => {
    const hoje = new Date()
    return credenciados.filter((c) => {
      const diffDias = Math.floor((hoje.getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      const dentroperiodo = periodo === 'all' || diffDias <= diasPeriodo
      const categoriaOk = categoriaFiltro === 'todas' || c.tipoCategoria === categoriaFiltro
      return dentroperiodo && categoriaOk
    })
  }, [credenciados, periodo, categoriaFiltro, diasPeriodo])

  // ── Estatísticas derivadas ───────────────────────────────────────────────
  const estatisticas = useMemo(() => {
    const porCategoria: Record<string, number> = {}
    const porUF: Record<string, number> = {}
    const porCidade: Record<string, number> = {}

    dadosFiltrados.forEach((c) => {
      porCategoria[c.tipoCategoria] = (porCategoria[c.tipoCategoria] ?? 0) + 1
      const uf = c.endereco?.estado ?? '?'
      porUF[uf] = (porUF[uf] ?? 0) + 1
      const cidade = `${c.endereco?.cidade ?? '?'}/${uf}`
      porCidade[cidade] = (porCidade[cidade] ?? 0) + 1
    })

    return { porCategoria, porUF, porCidade }
  }, [dadosFiltrados])

  // ── Maior categoria ──────────────────────────────────────────────────────
  const maiorCategoria = useMemo(() => {
    const entries = Object.entries(estatisticas.porCategoria)
    if (!entries.length) return '-'
    const [cat] = entries.sort((a, b) => b[1] - a[1])[0]
    return categoriaConfig[cat]?.label ?? cat
  }, [estatisticas.porCategoria])

  // ── Dados para gráficos ──────────────────────────────────────────────────
  const diarioData = useMemo(
    () => agruparPorDia(dadosFiltrados, Math.min(diasPeriodo, 30)),
    [dadosFiltrados, diasPeriodo],
  )

  const categoriaData = useMemo(
    () => Object.entries(estatisticas.porCategoria)
      .map(([key, value]) => ({
        name: categoriaConfig[key]?.label ?? key,
        value,
        color: categoriaConfig[key]?.color ?? '#999',
      }))
      .sort((a, b) => b.value - a.value),
    [estatisticas.porCategoria],
  )

  const cidadesData = useMemo(
    () => Object.entries(estatisticas.porCidade)
      .map(([cidade, credenciados]) => ({ cidade, credenciados }))
      .sort((a, b) => b.credenciados - a.credenciados)
      .slice(0, 10),
    [estatisticas.porCidade],
  )

  const total = dadosFiltrados.length

  // ── Exports ──────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    exportCSV(
      `credenciados_alta_cafe_2026_${new Date().toISOString().split('T')[0]}.csv`,
      ['ID', 'Nome', 'CPF', 'Email', 'Celular', 'Categoria', 'Município', 'UF', 'Data Cadastro'],
      dadosFiltrados.map(c => [
        c.id, c.nomeCompleto, c.cpf, c.email, c.celular,
        categoriaConfig[c.tipoCategoria]?.label ?? c.tipoCategoria,
        c.endereco?.cidade ?? '',
        c.endereco?.estado ?? '',
        new Date(c.createdAt).toLocaleDateString('pt-BR'),
      ]),
    )
    toast.success('CSV exportado com sucesso!')
  }

  const handleExportCidadesCSV = () => {
    exportCSV(
      'relatorio_cidades_alta_cafe_2026.csv',
      ['Posição', 'Cidade', 'Credenciados', 'Participação (%)'],
      cidadesData.map((c, i) => [
        i + 1, c.cidade, c.credenciados,
        total ? ((c.credenciados / total) * 100).toFixed(1) : '0',
      ]),
    )
    toast.success('Relatório de cidades exportado!')
  }

  const handleExportCategoriasCSV = () => {
    exportCSV(
      'relatorio_categorias_alta_cafe_2026.csv',
      ['Categoria', 'Quantidade', 'Participação (%)'],
      categoriaData.map(c => [
        c.name, c.value,
        total ? ((c.value / total) * 100).toFixed(1) : '0',
      ]),
    )
    toast.success('Relatório de categorias exportado!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Análises e métricas do credenciamento - Alta Café 2026</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCidadesCSV} disabled={isLoading}>
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Relatório</span> Cidades
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[160px] border-border bg-card">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="15d">Últimos 15 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="all">Todo o período</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
          <SelectTrigger className="w-[180px] border-border bg-card">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas categorias</SelectItem>
            {Object.entries(categoriaConfig).map(([value, { label }]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Credenciados</p>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : total.toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
              <Percent className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maior Categoria</p>
              <p className="text-lg font-bold text-foreground">
                {isLoading ? '...' : maiorCategoria}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <MapPin className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estados</p>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : Object.keys(estatisticas.porUF).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cidades</p>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : Object.keys(estatisticas.porCidade).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Credenciamentos por Dia
            </CardTitle>
            <CardDescription>Evolução diária dos novos cadastros</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                Carregando...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={diarioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7DED2" />
                  <XAxis dataKey="dia" stroke="#6B5D52" fontSize={12} />
                  <YAxis stroke="#6B5D52" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E7DED2', borderRadius: '8px' }}
                  />
                  <Bar dataKey="credenciados" fill="#119447" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Distribuição por Categoria</CardTitle>
              <CardDescription>Proporção de credenciados por tipo</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportCategoriasCSV} disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />CSV
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                Carregando...
              </div>
            ) : categoriaData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                Nenhum dado disponível.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoriaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoriaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E7DED2', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cities table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Cidades com Mais Credenciados
            </CardTitle>
            <CardDescription>Ranking das cidades com maior número de cadastros</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCidadesCSV} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead className="text-right">Credenciados</TableHead>
                  <TableHead className="text-right">Participação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : cidadesData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Nenhum dado disponível.
                    </TableCell>
                  </TableRow>
                ) : (
                  cidadesData.map((cidade, index) => (
                    <TableRow key={cidade.cidade}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{cidade.cidade}</TableCell>
                      <TableCell className="text-right font-medium">
                        {cidade.credenciados.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {total ? ((cidade.credenciados / total) * 100).toFixed(1) : '0'}%
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resumo por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo por Categoria</CardTitle>
          <CardDescription>Detalhamento dos credenciados por tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Participação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {categoriaData.map((cat) => (
                      <TableRow key={cat.name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                            {cat.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {cat.value.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {total ? ((cat.value / total) * 100).toFixed(1) : '0'}%
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{total.toLocaleString('pt-BR')}</TableCell>
                      <TableCell className="text-right">100%</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}