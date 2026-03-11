'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { dashboardKPIs } from '@/lib/mock-data'

const data = [
  { name: 'Expositores', value: dashboardKPIs.expositores, color: '#8B5CF6' },
  { name: 'Cafeicultores', value: dashboardKPIs.cafeicultores, color: '#F59E0B' },
  { name: 'Visitantes', value: dashboardKPIs.visitantes, color: '#0EA5E9' },
  { name: 'Imprensa', value: dashboardKPIs.imprensa, color: '#EC4899' },
]

export function CategoryChart() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold text-foreground">Distribuição por Categoria</h3>
        <p className="text-sm text-muted-foreground">Total: {dashboardKPIs.totalCredenciados.toLocaleString('pt-BR')} credenciados</p>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                      <p className="font-medium text-foreground">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.value.toLocaleString('pt-BR')} credenciados
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
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
