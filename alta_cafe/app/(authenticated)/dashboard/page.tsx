import {
  Users,
  Building2,
  Leaf,
  UserCheck,
  Newspaper,
} from 'lucide-react'
import { dashboardKPIs } from '@/lib/mock-data'
import { KPICard } from '@/components/admin/dashboard/kpi-card'
import { RecentRegistrations } from '@/components/admin/dashboard/recent-registrations'
import { CategoryChart } from '@/components/admin/dashboard/category-chart'
import { QuickActions } from '@/components/admin/dashboard/quick-actions'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do credenciamento - Alta Café 2026
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard
          title="Total Credenciados"
          value={dashboardKPIs.totalCredenciados}
          icon={Users}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Expositores"
          value={dashboardKPIs.expositores}
          icon={Building2}
          variant="default"
        />
        <KPICard
          title="Produtores"
          value={dashboardKPIs.produtores}
          icon={Leaf}
          variant="default"
        />
        <KPICard
          title="Visitantes"
          value={dashboardKPIs.visitantes}
          icon={UserCheck}
          variant="default"
        />
        <KPICard
          title="Imprensa"
          value={dashboardKPIs.imprensa}
          icon={Newspaper}
          variant="default"
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Recent registrations */}
        <div className="lg:col-span-2">
          <RecentRegistrations />
        </div>

        {/* Right column - Quick actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Bottom section - Chart */}
      <div>
        <CategoryChart />
      </div>
    </div>
  )
}
