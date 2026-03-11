'use client'

import Link from 'next/link'
import { 
  UserPlus, 
  Users, 
  BarChart3,
  Download,
  ArrowRight,
  Leaf,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const actions = [
  {
    label: 'Novo Credenciamento',
    href: '/credenciados/novo',
    icon: UserPlus,
    variant: 'default' as const,
  },
  {
    label: 'Ver Lista Completa',
    href: '/credenciados',
    icon: Users,
    variant: 'outline' as const,
  },
  {
    label: 'Relatórios',
    href: '/relatorios',
    icon: BarChart3,
    variant: 'outline' as const,
  },
  {
    label: 'Emissão de Carbono',
    href: '/carbono',
    icon: Leaf,
    variant: 'outline' as const,
  },
  {
    label: 'Exportar CSV',
    href: '/relatorios',
    icon: Download,
    variant: 'outline' as const,
  },
]

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold text-foreground">Ações Rápidas</h3>
        <p className="text-sm text-muted-foreground">Acesse as principais funcionalidades</p>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="justify-between"
            asChild
          >
            <Link href={action.href}>
              <span className="flex items-center gap-2">
                <action.icon className="h-4 w-4" />
                {action.label}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
