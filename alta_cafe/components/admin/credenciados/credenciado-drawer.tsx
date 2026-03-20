'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  FileText,
  CheckCircle,
  Clock,
  Shield,
  Edit,
  Car,
  Leaf,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Credenciado } from '@/lib/types'
import { 
  categoriasLabels, 
  categoriaColors,
  historicoCredenciado,
  calcularEmissaoCO2,
} from '@/lib/mock-data'

interface CredenciadoDrawerProps {
  credenciado: Credenciado | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (credenciado: Credenciado) => void
}

const transporteLabels: Record<string, string> = {
  CARRO: 'Carro',
  ONIBUS: 'Ônibus',
  AVIAO: 'Avião',
  MOTO: 'Moto',
}

export function CredenciadoDrawer({ credenciado, isOpen, onClose, onEdit }: CredenciadoDrawerProps) {
  if (!credenciado) return null

  const catColor = categoriaColors[credenciado.tipoCategoria]

  // Mock histórico filtrado pelo credenciado
  const historico = historicoCredenciado.filter(h => h.credenciadoId === credenciado.id)

  // Calcular emissão de carbono
  const emissaoCO2 = credenciado.distanciaKm && credenciado.meioTransporte 
    ? calcularEmissaoCO2(credenciado.distanciaKm, credenciado.meioTransporte)
    : null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-left text-xl font-bold text-foreground">
                  {credenciado.nomeCompleto}
                </SheetTitle>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className={cn('font-medium', catColor.bg, catColor.text)}>
                    {categoriasLabels[credenciado.tipoCategoria]}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Contact info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Informações de Contato</h4>
            <div className="space-y-2.5 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{credenciado.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{credenciado.celular}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {credenciado.rua ? `${credenciado.rua}, ` : ''}{credenciado.municipio}/{credenciado.uf}
                </span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Documentos</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">CPF</p>
                <p className="font-mono text-sm font-medium text-foreground">{credenciado.cpf}</p>
              </div>
              {credenciado.rg && (
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">RG</p>
                  <p className="font-mono text-sm font-medium text-foreground">{credenciado.rg}</p>
                </div>
              )}
              {credenciado.cnpj && (
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">CNPJ</p>
                  <p className="font-mono text-sm font-medium text-foreground">{credenciado.cnpj}</p>
                </div>
              )}
              {credenciado.ccir && (
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">CCIR</p>
                  <p className="font-mono text-sm font-medium text-foreground">{credenciado.ccir}</p>
                </div>
              )}
            </div>
          </div>

          {/* Company info (if applicable) */}
          {(credenciado.empresa || credenciado.cargo) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Empresa / Instituição</h4>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                {credenciado.empresa && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{credenciado.empresa}</span>
                  </div>
                )}
                {credenciado.cargo && (
                  <div className="mt-2 flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{credenciado.cargo}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Carbon footprint info */}
          {(credenciado.cidadeOrigem || credenciado.distanciaKm) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Deslocamento e Pegada de Carbono</h4>
              <div className="rounded-xl border border-border bg-green-50 p-4 space-y-3">
                {credenciado.cidadeOrigem && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-foreground">
                      Origem: {credenciado.cidadeOrigem}/{credenciado.estadoOrigem}
                    </span>
                  </div>
                )}
                {credenciado.distanciaKm !== undefined && (
                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-foreground">
                      Distância: {credenciado.distanciaKm.toLocaleString('pt-BR')} km
                      {credenciado.meioTransporte && ` (${transporteLabels[credenciado.meioTransporte]})`}
                    </span>
                  </div>
                )}
                {emissaoCO2 !== null && (
                  <div className="flex items-center gap-3">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Emissão estimada: {emissaoCO2.toFixed(1)} kg CO2
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LGPD */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
            <Shield className={cn('h-5 w-5', credenciado.aceiteLgpd ? 'text-green-600' : 'text-red-600')} />
            <div>
              <p className="text-sm font-medium text-foreground">Aceite LGPD</p>
              <p className="text-xs text-muted-foreground">
                {credenciado.aceiteLgpd ? 'Consentimento registrado' : 'Pendente de aceite'}
              </p>
            </div>
          </div>

          <Separator />

          <Separator />
          
          {/* Operações (Ocultas temporariamente conforme pedido do usuário) */}
          {/* 
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Ações</h4>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onEdit?.(credenciado)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar Cadastro
            </Button>
          </div>
          */}

          <Separator />

          {/* History */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Histórico</h4>
            <div className="space-y-3">
              {historico.length > 0 ? (
                historico.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{item.descricao}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.dataHora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        {item.usuario && ` - ${item.usuario}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex gap-3 rounded-xl border border-border bg-muted/30 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">Cadastro criado</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(credenciado.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
