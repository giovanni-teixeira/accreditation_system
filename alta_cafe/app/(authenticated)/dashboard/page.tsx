'use client'

import { useEffect, useState } from 'react'
import { Users, Building2, Leaf, UserCheck, Newspaper } from 'lucide-react'
import {
  credenciadosService,
  ICredenciado,
  IDashboardKPIs,
  TipoCategoria,
} from '@/lib/api.service'
import { KPICard } from '@/components/admin/dashboard/kpi-card'
import { RecentRegistrations } from '@/components/admin/dashboard/recent-registrations'
import { CategoryChart } from '@/components/admin/dashboard/category-chart'
import { QuickActions } from '@/components/admin/dashboard/quick-actions'

function buildKPIs(credenciados: ICredenciado[]): IDashboardKPIs {
  return {
    totalCredenciados: credenciados.length,
    expositores:   credenciados.filter(c => c.tipoCategoria === TipoCategoria.EXPOSITOR).length,
    produtores:    credenciados.filter(c => c.tipoCategoria === TipoCategoria.PRODUTOR).length,
    visitantes:    credenciados.filter(c => c.tipoCategoria === TipoCategoria.VISITANTE).length,
    imprensa:      credenciados.filter(c => c.tipoCategoria === TipoCategoria.IMPRENSA).length,
    organizacao:   credenciados.filter(c => c.tipoCategoria === TipoCategoria.ORGANIZACAO).length,
    terceirizado:  credenciados.filter(c => c.tipoCategoria === TipoCategoria.TERCEIRIZADO).length,
  }
}

export default function DashboardPage() {
  const [credenciados, setCredenciados] = useState<ICredenciado[]>([])
  const [kpis, setKpis] = useState<IDashboardKPIs | null>(null)

  useEffect(() => {
    credenciadosService.listar()
      .then((data) => {
        setCredenciados(data)
        setKpis(buildKPIs(data))
      })
      .catch((err) => console.error('[DashboardPage] Erro ao buscar credenciados:', err))
  }, [])

  const recentRegistrations = Array.isArray(credenciados) 
    ? [...credenciados]
        .filter(c => c && c.createdAt)
        .sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA)
        })
        .slice(0, 10)
        .map(c => ({
          id: c.id,
          nomeCompleto: c.nomeCompleto,
          tipoCategoria: c.tipoCategoria,
          email: c.email,
          createdAt: c.createdAt,
          credencial: c.credencial ? { status: c.credencial.status } : null,
        }))
    : []

  const categoryChart = Object.values(TipoCategoria)
    .map(categoria => ({
      categoria,
      total: credenciados.filter(c => c.tipoCategoria === categoria).length,
    }))
    .filter(item => item.total > 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do credenciamento - Alta Café 2026
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard title="Total Credenciados" value={kpis?.totalCredenciados ?? 0} icon={Users} variant="primary" />
        <KPICard title="Expositores"         value={kpis?.expositores ?? 0}       icon={Building2} variant="default" />
        <KPICard title="Produtores"          value={kpis?.produtores ?? 0}        icon={Leaf} variant="default" />
        <KPICard title="Visitantes"          value={kpis?.visitantes ?? 0}        icon={UserCheck} variant="default" />
        <KPICard title="Imprensa"            value={kpis?.imprensa ?? 0}          icon={Newspaper} variant="default" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentRegistrations data={recentRegistrations} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div>
        <CategoryChart data={categoryChart} />
      </div>
    </div>
  )
}