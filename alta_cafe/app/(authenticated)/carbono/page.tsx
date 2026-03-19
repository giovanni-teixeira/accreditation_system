'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Leaf, Car, Fuel, Zap, TreeDeciduous,
  Download, TrendingDown, MapPin, Loader2,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  descarbonizacaoService,
  IDescarbonizacao,
  IDescarbonizacaoSummary,
  TipoCombustivel,
} from '@/lib/api.service'

// ─── Config por combustível ───────────────────────────────────────────────────
const combustivelConfig: Record<string, {
  label: string
  color: string
  icon: React.ElementType
  fatorKgPorKm: number
}> = {
  [TipoCombustivel.GASOLINA]: { label: 'Gasolina', color: '#EF4444', icon: Car,  fatorKgPorKm: 0.21 },
  [TipoCombustivel.ETANOL]:   { label: 'Etanol',   color: '#F59E0B', icon: Fuel, fatorKgPorKm: 0.10 },
  [TipoCombustivel.DIESEL]:   { label: 'Diesel',   color: '#6B7280', icon: Car,  fatorKgPorKm: 0.27 },
  [TipoCombustivel.ELETRICO]: { label: 'Elétrico', color: '#22C55E', icon: Zap,  fatorKgPorKm: 0.05 },
}

// ─── Helper CSV ───────────────────────────────────────────────────────────────
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
export default function CarbonoPage() {
  const [registros, setRegistros] = useState<IDescarbonizacao[]>([])
  const [summary, setSummary] = useState<IDescarbonizacaoSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      descarbonizacaoService.listar(),
      descarbonizacaoService.summary(),
    ])
      .then(([regs, sum]) => {
        setRegistros(regs)
        setSummary(sum)
      })
      .catch(() => toast.error('Erro ao carregar dados de descarbonização.'))
      .finally(() => setIsLoading(false))
  }, [])

  // ── Métricas derivadas ────────────────────────────────────────────────────
  const totalCo2   = summary?.totalCo2Kg       ?? registros.reduce((a, r) => a + (r.pegadaCo2 ?? 0), 0)
  const totalKm    = summary?.totalDistanciaKm ?? registros.reduce((a, r) => a + r.distanciaIdaVoltaKm, 0)
  const totalPessoas = summary?.totalCredenciados ?? registros.length
  const mediaPorPessoa = totalPessoas > 0 ? totalCo2 / totalPessoas : 0
  const arvoresNecessarias = Math.ceil(totalCo2 / 22)

  // ── Agrupamento por combustível ───────────────────────────────────────────
  const porCombustivel = useMemo(() => {
    const map: Record<string, { emissaoKg: number; quantidade: number; distanciaKm: number }> = {}
    registros.forEach((r) => {
      const key = r.tipoCombustivel
      if (!map[key]) map[key] = { emissaoKg: 0, quantidade: 0, distanciaKm: 0 }
      map[key].emissaoKg   += r.pegadaCo2 ?? 0
      map[key].quantidade  += 1
      map[key].distanciaKm += r.distanciaIdaVoltaKm
    })
    return map
  }, [registros])

  const barData = useMemo(() =>
    Object.entries(porCombustivel)
      .map(([key, v]) => ({
        combustivel: combustivelConfig[key]?.label ?? key,
        emissao: Math.round(v.emissaoKg),
        quantidade: v.quantidade,
        color: combustivelConfig[key]?.color ?? '#999',
      }))
      .filter(d => d.emissao > 0)
      .sort((a, b) => b.emissao - a.emissao),
    [porCombustivel],
  )

  const pieData = barData.map(d => ({
    name: d.combustivel,
    value: d.emissao,
    color: d.color,
  }))

  // ── Top emissores ─────────────────────────────────────────────────────────
  const topEmissores = useMemo(() =>
    [...registros]
      .sort((a, b) => (b.pegadaCo2 ?? 0) - (a.pegadaCo2 ?? 0))
      .slice(0, 10),
    [registros],
  )

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    exportCSV(
      'emissao_carbono_alta_cafe_2026.csv',
      ['ID Credenciado', 'Combustível', 'Distância Ida+Volta (km)', 'Pegada CO2 (kg)'],
      registros.map(r => [
        r.credenciadoId,
        combustivelConfig[r.tipoCombustivel]?.label ?? r.tipoCombustivel,
        r.distanciaIdaVoltaKm.toFixed(1),
        (r.pegadaCo2 ?? 0).toFixed(2),
      ]),
    )
    toast.success('CSV exportado com sucesso!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Emissão de Carbono</h1>
          <p className="text-muted-foreground">
            Análise de emissões de CO2 pelo deslocamento dos participantes
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <Leaf className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emissão Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : totalCo2.toFixed(0)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">kg CO2</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <TreeDeciduous className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Árvores para Compensar</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : arvoresNecessarias}
                  <span className="text-sm font-normal text-muted-foreground ml-1">árvores/ano</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Distância Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : Math.round(totalKm).toLocaleString('pt-BR')}
                  <span className="text-sm font-normal text-muted-foreground ml-1">km</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <TrendingDown className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média por Pessoa</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : mediaPorPessoa.toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">kg CO2</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fatores de emissão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fatores de Emissão Utilizados</CardTitle>
          <CardDescription>Valores de referência por tipo de combustível</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {Object.entries(combustivelConfig).map(([key, cfg]) => {
              const Icon = cfg.icon
              return (
                <div key={key} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${cfg.color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cfg.label}</p>
                    <p className="text-xs text-muted-foreground">{cfg.fatorKgPorKm} kg CO2/km</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Emissão por Combustível</CardTitle>
            <CardDescription>Total de CO2 emitido por tipo de combustível</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : barData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                Nenhum dado disponível.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7DED2" />
                  <XAxis dataKey="combustivel" stroke="#6B5D52" fontSize={12} />
                  <YAxis stroke="#6B5D52" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E7DED2', borderRadius: '8px' }}
                    formatter={(v: number) => [`${v} kg CO2`, 'Emissão']}
                  />
                  <Bar dataKey="emissao" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proporção por Combustível</CardTitle>
            <CardDescription>Participação de cada combustível nas emissões</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : pieData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                Nenhum dado disponível.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E7DED2', borderRadius: '8px' }}
                    formatter={(v: number, name: string) => [`${v} kg CO2`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top emissores */}
      <Card>
        <CardHeader>
          <CardTitle>Maiores Emissores</CardTitle>
          <CardDescription>Top 10 registros com maior pegada de carbono</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>ID Credenciado</TableHead>
                  <TableHead>Combustível</TableHead>
                  <TableHead className="text-right">Distância (km)</TableHead>
                  <TableHead className="text-right">Emissão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : topEmissores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum dado disponível.
                    </TableCell>
                  </TableRow>
                ) : (
                  topEmissores.map((item, index) => {
                    const cfg = combustivelConfig[item.tipoCombustivel]
                    const Icon = cfg?.icon ?? Car
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{item.credenciadoId}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="gap-1"
                            style={{
                              backgroundColor: `${cfg?.color ?? '#999'}20`,
                              color: cfg?.color ?? '#999',
                            }}
                          >
                            <Icon className="h-3 w-3" />
                            {cfg?.label ?? item.tipoCombustivel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.distanciaIdaVoltaKm.toLocaleString('pt-BR')} km
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {(item.pegadaCo2 ?? 0).toFixed(1)} kg CO2
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sugestões */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Sugestões para Compensação</CardTitle>
          <CardDescription className="text-green-700">
            Ações recomendadas para neutralizar a emissão de carbono do evento
          </CardDescription>
        </CardHeader>
        <CardContent className="text-green-800 text-sm space-y-2">
          <div className="flex items-start gap-2">
            <TreeDeciduous className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Plantar <strong>{arvoresNecessarias} árvores</strong> para compensar as emissões em 1 ano</span>
          </div>
          <div className="flex items-start gap-2">
            <Car className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Incentivar o uso de veículos elétricos e etanol para reduzir emissões futuras</span>
          </div>
          <div className="flex items-start gap-2">
            <Leaf className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Parceria com programas de crédito de carbono certificados</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Criar programa de carona solidária entre participantes da mesma região</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}