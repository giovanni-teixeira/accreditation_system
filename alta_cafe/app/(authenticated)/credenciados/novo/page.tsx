'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { ufs, categoriasLabels } from '@/lib/mock-data'
import type { CategoriaCredenciado } from '@/lib/types'

export default function NovoCredenciamentoPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [categoria, setCategoria] = useState<CategoriaCredenciado | ''>('')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [cpf, setCpf] = useState('')
  const [rg, setRg] = useState('')
  const [email, setEmail] = useState('')
  const [celular, setCelular] = useState('')
  const [rua, setRua] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [uf, setUf] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [cargo, setCargo] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [ccir, setCcir] = useState('')
  const [cidadeOrigem, setCidadeOrigem] = useState('')
  const [estadoOrigem, setEstadoOrigem] = useState('')
  const [distanciaKm, setDistanciaKm] = useState('')
  const [meioTransporte, setMeioTransporte] = useState<'CARRO' | 'ONIBUS' | 'AVIAO' | 'MOTO' | ''>('')
  const [aceiteLgpd, setAceiteLgpd] = useState(false)

  // Validar CPF (formato simples)
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  // Validar celular (formato simples)
  const formatCelular = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (!categoria) {
      toast.error('Selecione uma categoria')
      return
    }
    if (!nomeCompleto.trim()) {
      toast.error('Informe o nome completo')
      return
    }
    if (!cpf.trim()) {
      toast.error('Informe o CPF')
      return
    }
    if (!email.trim()) {
      toast.error('Informe o e-mail')
      return
    }
    if (!celular.trim()) {
      toast.error('Informe o celular')
      return
    }
    if (!municipio.trim()) {
      toast.error('Informe o município')
      return
    }
    if (!uf) {
      toast.error('Selecione o estado (UF)')
      return
    }
    if (!aceiteLgpd) {
      toast.error('É necessário aceitar os termos da LGPD')
      return
    }

    // Validações por categoria
    if ((categoria === 'EXPOSITOR' || categoria === 'IMPRENSA') && !cnpj.trim()) {
      toast.error('CNPJ é obrigatório para esta categoria')
      return
    }
    if (categoria === 'CAFEICULTOR' && !ccir.trim()) {
      toast.error('CCIR é obrigatório para cafeicultores')
      return
    }

    setIsSaving(true)

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success('Credenciamento realizado com sucesso!')
    router.push('/credenciados')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/credenciados">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Novo Credenciamento</h1>
          <p className="text-muted-foreground">
            Cadastre um novo participante para o evento
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Categoria</CardTitle>
            <CardDescription>Selecione o tipo de credenciamento</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={categoria} onValueChange={(v) => setCategoria(v as CategoriaCredenciado)}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoriasLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Informações de identificação do participante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  placeholder="RG (opcional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular">Celular *</Label>
                <Input
                  id="celular"
                  value={celular}
                  onChange={(e) => setCelular(formatCelular(e.target.value))}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>Localização do participante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="rua">Rua / Endereço</Label>
                <Input
                  id="rua"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  placeholder="Rua, número (opcional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipio">Município *</Label>
                <Input
                  id="municipio"
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  placeholder="Cidade"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">Estado (UF) *</Label>
                <Select value={uf} onValueChange={setUf}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ufs.map((estado) => (
                      <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados de Deslocamento (para cálculo de carbono) */}
        <Card>
          <CardHeader>
            <CardTitle>Deslocamento</CardTitle>
            <CardDescription>Informações para cálculo de emissão de carbono</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cidadeOrigem">Cidade de Origem</Label>
                <Input
                  id="cidadeOrigem"
                  value={cidadeOrigem}
                  onChange={(e) => setCidadeOrigem(e.target.value)}
                  placeholder="De onde vem"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estadoOrigem">Estado de Origem</Label>
                <Select value={estadoOrigem} onValueChange={setEstadoOrigem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ufs.map((estado) => (
                      <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distancia">Distância até o evento (km)</Label>
                <Input
                  id="distancia"
                  type="number"
                  value={distanciaKm}
                  onChange={(e) => setDistanciaKm(e.target.value)}
                  placeholder="Distância em km"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transporte">Meio de Transporte</Label>
                <Select value={meioTransporte} onValueChange={(v) => setMeioTransporte(v as typeof meioTransporte)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CARRO">Carro</SelectItem>
                    <SelectItem value="ONIBUS">Ônibus</SelectItem>
                    <SelectItem value="AVIAO">Avião</SelectItem>
                    <SelectItem value="MOTO">Moto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Profissionais (condicional) */}
        {categoria && (
          <Card>
            <CardHeader>
              <CardTitle>Dados Profissionais</CardTitle>
              <CardDescription>
                {categoria === 'EXPOSITOR' && 'Informações da empresa expositora'}
                {categoria === 'CAFEICULTOR' && 'Informações da propriedade rural'}
                {categoria === 'IMPRENSA' && 'Informações do veículo de comunicação'}
                {categoria === 'VISITANTE' && 'Informações adicionais (opcional)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="empresa">
                    {categoria === 'CAFEICULTOR' ? 'Nome da Propriedade' : 'Empresa / Instituição'}
                    {(categoria === 'EXPOSITOR' || categoria === 'IMPRENSA') && ' *'}
                  </Label>
                  <Input
                    id="empresa"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder={categoria === 'CAFEICULTOR' ? 'Nome da fazenda' : 'Nome da empresa'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo / Função</Label>
                  <Input
                    id="cargo"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="Cargo ou função"
                  />
                </div>
                {(categoria === 'EXPOSITOR' || categoria === 'IMPRENSA') && (
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                )}
                {categoria === 'CAFEICULTOR' && (
                  <div className="space-y-2">
                    <Label htmlFor="ccir">CCIR *</Label>
                    <Input
                      id="ccir"
                      value={ccir}
                      onChange={(e) => setCcir(e.target.value)}
                      placeholder="Número do CCIR"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* LGPD */}
        <Card>
          <CardHeader>
            <CardTitle>Termo de Consentimento</CardTitle>
            <CardDescription>Lei Geral de Proteção de Dados (LGPD)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Checkbox
                id="lgpd"
                checked={aceiteLgpd}
                onCheckedChange={(checked) => setAceiteLgpd(checked as boolean)}
              />
              <label htmlFor="lgpd" className="text-sm leading-relaxed text-muted-foreground cursor-pointer">
                Declaro que li e concordo com os termos de uso e política de privacidade, autorizando o tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button variant="outline" type="button" asChild>
            <Link href="/credenciados">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Credenciamento
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
