'use client'

import { useState, useMemo } from 'react'
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { dashboardKPIs, credenciados, cidadesData, diarioData, categoriasLabels } from '@/lib/mock-data'

// Dados para gráfico de pizza
const categoriaData = [
  { name: 'Expositores', value: dashboardKPIs.expositores, color: '#0000FF' },
  { name: 'Produtores', value: dashboardKPIs.produtores, color: '#00FF00' },
  { name: 'Visitantes', value: dashboardKPIs.visitantes, color: '#8B008B' },
  { name: 'Imprensa', value: dashboardKPIs.imprensa, color: '#778899' },
]

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState('7d')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')

  // Filtrar dados baseado no filtro de categoria
  const dadosFiltrados = useMemo(() => {
    if (categoriaFiltro === 'todas') return credenciados
    return credenciados.filter(c => c.tipoCategoria === categoriaFiltro)
  }, [categoriaFiltro])

  // Calcular estatísticas
  const estatisticas = useMemo(() => {
    const porCategoria = {
      EXPOSITOR: dadosFiltrados.filter(c => c.tipoCategoria === 'EXPOSITOR').length,
      PRODUTOR: dadosFiltrados.filter(c => c.tipoCategoria === 'PRODUTOR').length,
      VISITANTE: dadosFiltrados.filter(c => c.tipoCategoria === 'VISITANTE').length,
      IMPRENSA: dadosFiltrados.filter(c => c.tipoCategoria === 'IMPRENSA').length,
    }

    const porUF: Record<string, number> = {}
    dadosFiltrados.forEach(c => {
      porUF[c.uf] = (porUF[c.uf] || 0) + 1
    })

    const porCidade: Record<string, number> = {}
    dadosFiltrados.forEach(c => {
      const key = `${c.municipio}/${c.uf}`
      porCidade[key] = (porCidade[key] || 0) + 1
    })

    return { porCategoria, porUF, porCidade }
  }, [dadosFiltrados])

  // Exportar CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'CPF', 'Email', 'Celular', 'Categoria', 'Empresa', 'Cargo', 'Município', 'UF', 'Data Cadastro']
    const rows = dadosFiltrados.map(c => [
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

  // Exportar relatório de cidades
  const handleExportCidadesCSV = () => {
    const headers = ['Posição', 'Cidade', 'Credenciados', 'Participação (%)']
    const rows = cidadesData.map((cidade, index) => {
      const participacao = ((cidade.credenciados / dashboardKPIs.totalCredenciados) * 100).toFixed(1)
      return [index + 1, cidade.cidade, cidade.credenciados, participacao]
    })

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `relatorio_cidades_alta_cafe_2026.csv`
    link.click()

    toast.success('Relatório de cidades exportado!')
  }

  // Exportar relatório por categoria
  const handleExportCategoriasCSV = () => {
    const headers = ['Categoria', 'Quantidade', 'Participação (%)']
    const rows = categoriaData.map(cat => [
      cat.name,
      cat.value,
      ((cat.value / dashboardKPIs.totalCredenciados) * 100).toFixed(1)
    ])

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `relatorio_categorias_alta_cafe_2026.csv`
    link.click()

    toast.success('Relatório de categorias exportado!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises e métricas do credenciamento - Alta Café 2026
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCidadesCSV}>
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Relatório</span> Cidades
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[140px] sm:w-[160px] border-border bg-card">
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
          <SelectTrigger className="w-[140px] sm:w-[160px] border-border bg-card">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas categorias</SelectItem>
            <SelectItem value="EXPOSITOR">Expositores</SelectItem>
            <SelectItem value="PRODUTOR">Produtores</SelectItem>
            <SelectItem value="VISITANTE">Visitantes</SelectItem>
            <SelectItem value="IMPRENSA">Imprensa</SelectItem>
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
              <p className="text-2xl font-bold text-foreground">{dashboardKPIs.totalCredenciados}</p>
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
              <p className="text-2xl font-bold text-foreground">Visitantes</p>
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
              <p className="text-2xl font-bold text-foreground">{Object.keys(estatisticas.porUF).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Crescimento</p>
              <p className="text-2xl font-bold text-foreground">+23%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar chart - Daily registrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Credenciamentos por Dia
            </CardTitle>
            <CardDescription>Evolução diária dos novos cadastros</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diarioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7DED2" />
                <XAxis dataKey="dia" stroke="#6B5D52" fontSize={12} />
                <YAxis stroke="#6B5D52" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E7DED2',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="credenciados" fill="#119447" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart - Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Distribuição por Categoria</CardTitle>
              <CardDescription>Proporção de credenciados por tipo</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportCategoriasCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
          </CardHeader>
          <CardContent>
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
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E7DED2',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
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
          <Button variant="outline" size="sm" onClick={handleExportCidadesCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
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
                {cidadesData.map((cidade, index) => {
                  const participacao = ((cidade.credenciados / dashboardKPIs.totalCredenciados) * 100).toFixed(1)
                  return (
                    <TableRow key={cidade.cidade}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{cidade.cidade}</TableCell>
                      <TableCell className="text-right font-medium">
                        {cidade.credenciados.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {participacao}%
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Estatístico */}
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
                {categoriaData.map((cat) => (
                  <TableRow key={cat.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {cat.value.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {((cat.value / dashboardKPIs.totalCredenciados) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{dashboardKPIs.totalCredenciados.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
