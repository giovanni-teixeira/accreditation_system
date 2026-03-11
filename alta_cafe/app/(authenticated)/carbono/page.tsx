'use client'

import { useMemo } from 'react'
import { 
  Leaf, 
  Car, 
  Bus, 
  Plane, 
  Bike,
  TreeDeciduous,
  Download,
  TrendingDown,
  MapPin,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { calcularEmissaoTotal, fatoresEmissao } from '@/lib/mock-data'

const transporteIcons: Record<string, React.ElementType> = {
  CARRO: Car,
  ONIBUS: Bus,
  AVIAO: Plane,
  MOTO: Bike,
}

const transporteLabels: Record<string, string> = {
  CARRO: 'Carro',
  ONIBUS: 'Ônibus',
  AVIAO: 'Avião',
  MOTO: 'Moto',
}

const transporteColors: Record<string, string> = {
  CARRO: '#EF4444',
  ONIBUS: '#22C55E',
  AVIAO: '#3B82F6',
  MOTO: '#F59E0B',
}

export default function CarbonoPage() {
  const emissaoData = useMemo(() => calcularEmissaoTotal(), [])
  
  // Dados para o gráfico de pizza
  const pieData = Object.entries(emissaoData.porTransporte).map(([key, value]) => ({
    name: transporteLabels[key],
    value: Math.round(value.emissaoKg),
    quantidade: value.quantidade,
    color: transporteColors[key],
  })).filter(item => item.value > 0)

  // Dados para o gráfico de barras
  const barData = Object.entries(emissaoData.porTransporte).map(([key, value]) => ({
    transporte: transporteLabels[key],
    emissao: Math.round(value.emissaoKg),
    quantidade: value.quantidade,
  })).filter(item => item.emissao > 0)

  // Cálculo de árvores necessárias para compensar (1 árvore absorve ~22kg CO2/ano)
  const arvoresNecessarias = Math.ceil(emissaoData.totalKgCO2 / 22)

  // Ordenar credenciados por emissão
  const topEmissores = [...emissaoData.porCredenciado]
    .sort((a, b) => b.emissaoKg - a.emissaoKg)
    .slice(0, 10)

  const handleExportCSV = () => {
    const headers = ['Nome', 'Cidade', 'Distância (km)', 'Transporte', 'Emissão (kg CO2)']
    const rows = emissaoData.porCredenciado.map(c => [
      c.nome,
      c.cidade,
      c.distancia.toString(),
      transporteLabels[c.transporte],
      c.emissaoKg.toFixed(2)
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'emissao_carbono_alta_cafe_2026.csv'
    link.click()
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
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
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
                  {emissaoData.totalKgCO2.toFixed(0)}
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
                  {arvoresNecessarias}
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
                  {emissaoData.porCredenciado.reduce((acc, c) => acc + c.distancia, 0).toLocaleString('pt-BR')}
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
                  {(emissaoData.totalKgCO2 / emissaoData.porCredenciado.length).toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">kg CO2</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fatores de Emissão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fatores de Emissão Utilizados</CardTitle>
          <CardDescription>Valores de referência para cálculo de emissão por tipo de transporte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {Object.entries(fatoresEmissao).map(([key, value]) => {
              const Icon = transporteIcons[key]
              return (
                <div key={key} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div 
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${transporteColors[key]}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: transporteColors[key] }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{transporteLabels[key]}</p>
                    <p className="text-xs text-muted-foreground">{value} kg CO2/km</p>
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
            <CardTitle>Emissão por Meio de Transporte</CardTitle>
            <CardDescription>Distribuição das emissões de CO2</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7DED2" />
                <XAxis dataKey="transporte" stroke="#6B5D52" fontSize={12} />
                <YAxis stroke="#6B5D52" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E7DED2',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value} kg CO2`, 'Emissão']}
                />
                <Bar dataKey="emissao" fill="#119447" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proporção por Transporte</CardTitle>
            <CardDescription>Participação de cada meio de transporte</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E7DED2',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [`${value} kg CO2`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Emissores */}
      <Card>
        <CardHeader>
          <CardTitle>Maiores Emissores</CardTitle>
          <CardDescription>Top 10 participantes com maior emissão de carbono</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Participante</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Distância</TableHead>
                <TableHead>Transporte</TableHead>
                <TableHead className="text-right">Emissão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topEmissores.map((item, index) => {
                const Icon = transporteIcons[item.transporte]
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{item.cidade}</TableCell>
                    <TableCell>{item.distancia.toLocaleString('pt-BR')} km</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className="gap-1"
                        style={{ 
                          backgroundColor: `${transporteColors[item.transporte]}20`,
                          color: transporteColors[item.transporte]
                        }}
                      >
                        <Icon className="h-3 w-3" />
                        {transporteLabels[item.transporte]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.emissaoKg.toFixed(1)} kg CO2
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sugestões de Compensação */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Sugestões para Compensação</CardTitle>
          <CardDescription className="text-green-700">
            Ações recomendadas para neutralizar a emissão de carbono do evento
          </CardDescription>
        </CardHeader>
        <CardContent className="text-green-800">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <TreeDeciduous className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Plantar <strong>{arvoresNecessarias} árvores</strong> para compensar as emissões em 1 ano</span>
            </li>
            <li className="flex items-start gap-2">
              <Bus className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Incentivar transporte coletivo para edições futuras</span>
            </li>
            <li className="flex items-start gap-2">
              <Leaf className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Parceria com programas de crédito de carbono certificados</span>
            </li>
            <li className="flex items-start gap-2">
              <Car className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Criar programa de carona solidária entre participantes da mesma região</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
