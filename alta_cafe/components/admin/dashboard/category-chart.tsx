'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { TipoCategoria } from '@/lib/api.service'

const categoriaColors: Record<TipoCategoria, string> = {
  EXPOSITOR: '#0000FF',
  VISITANTE: '#8B008B',
  PRODUTOR: '#00FF00',
  IMPRENSA: '#778899',
  ORGANIZACAO: '#FF8C00',
  TERCEIRIZADO: '#DC143C',
}

const categoriasLabels: Record<TipoCategoria, string> = {
  EXPOSITOR: 'Expositores',
  VISITANTE: 'Visitantes',
  PRODUTOR: 'Produtores',
  IMPRENSA: 'Imprensa',
  ORGANIZACAO: 'Organização',
  TERCEIRIZADO: 'Terceirizados',
}

interface CategoryChartItem {
  categoria: TipoCategoria
  total: number
}

interface CategoryChartProps {
  data: CategoryChartItem[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.map((item) => ({
    name: categoriasLabels[item.categoria],
    value: item.total,
    color: categoriaColors[item.categoria],
  }))

  const total = data.reduce((acc, item) => acc + item.total, 0)

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold text-foreground">Distribuição por Categoria</h3>
        <p className="text-sm text-muted-foreground">
          Total: {total.toLocaleString('pt-BR')} credenciados
        </p>
      </div>
      <div className="p-5">
        {chartData.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
            Nenhum dado disponível.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    return (
                      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.value.toLocaleString('pt-BR')} credenciados
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}