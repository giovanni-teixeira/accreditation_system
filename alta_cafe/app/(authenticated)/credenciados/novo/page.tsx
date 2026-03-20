'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Download } from 'lucide-react'
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
import { ufs } from '@/lib/mock-data'
import { credenciadosService, TipoCategoria, TipoCombustivel, ICredenciado } from '@/lib/api.service'
import CredentialPDF from '@/components/CredentialPDF'

// Apenas as categorias internas da organização
const categoriasDisponiveis = [
  { value: TipoCategoria.ORGANIZACAO,  label: 'Organizadora' },
  { value: TipoCategoria.TERCEIRIZADO, label: 'Terceirizado' },
]

const corPorCategoria: Record<string, string> = {
  [TipoCategoria.ORGANIZACAO]:  '#1a5c2a',
  [TipoCategoria.TERCEIRIZADO]: '#7b3f00',
}

export default function NovoCredenciamentoPage() {
  const router = useRouter()
  const pdfRef = useRef<HTMLDivElement>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [credenciadoSalvo, setCredenciadoSalvo] = useState<ICredenciado | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Form state
  const [categoria, setCategoria] = useState<TipoCategoria | ''>('')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [cpf, setCpf] = useState('')
  const [rg, setRg] = useState('')
  const [email, setEmail] = useState('')
  const [celular, setCelular] = useState('')
  const [rua, setRua] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [uf, setUf] = useState('')
  const [setor, setSetor] = useState('')
  const [distanciaKm, setDistanciaKm] = useState('')
  const [aceiteLgpd, setAceiteLgpd] = useState(false)

  const formatCPF = (value: string) => {
    const n = value.replace(/\D/g, '').slice(0, 11)
    return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatCelular = (value: string) => {
    const n = value.replace(/\D/g, '').slice(0, 11)
    return n.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoria)         return toast.error('Selecione uma categoria')
    if (!nomeCompleto.trim()) return toast.error('Informe o nome completo')
    if (!cpf.trim())        return toast.error('Informe o CPF')
    if (!email.trim())      return toast.error('Informe o e-mail')
    if (!celular.trim())    return toast.error('Informe o celular')
    if (!municipio.trim())  return toast.error('Informe o município')
    if (!uf)                return toast.error('Selecione o estado (UF)')
    if (!aceiteLgpd)        return toast.error('É necessário aceitar os termos da LGPD')

    setIsSaving(true)

    try {
      const resultado = await credenciadosService.cadastrar({
        nomeCompleto,
        cpf: cpf.replace(/\D/g, ''),
        rg: rg || undefined,
        celular: celular.replace(/\D/g, ''),
        email,
        cidade: municipio,
        estado: uf,
        rua: rua || undefined,
        pais: 'Brasil',
        aceiteLgpd,
        tipoCategoria: categoria as TipoCategoria,
        tipoCombustivel: TipoCombustivel.GASOLINA,
        distanciaManualKm: distanciaKm ? Number(distanciaKm) : undefined,
        nomeEmpresa: setor || undefined,
      })

      setCredenciadoSalvo(resultado)
      toast.success('Credenciamento realizado com sucesso!')
    } catch (error: any) {
      toast.error(error.message ?? 'Erro ao salvar credenciamento.')
      setIsSaving(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!credenciadoSalvo) return
    setIsGeneratingPDF(true)

    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = pdfRef.current

      if (!element) return

      await html2pdf()
        .set({
          margin: 0,
          filename: `credencial_${credenciadoSalvo.nomeCompleto.replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            logging: false,
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
          },
        })
        .from(element)
        .save()

      toast.success('PDF gerado com sucesso!')
    } catch {
      toast.error('Erro ao gerar PDF.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Dados para o PDF
  const pdfUserData = credenciadoSalvo
    ? {
        nomeCompleto: credenciadoSalvo.nomeCompleto,
        role: categoriasDisponiveis.find(c => c.value === credenciadoSalvo.tipoCategoria)?.label ?? credenciadoSalvo.tipoCategoria,
        cidade: municipio,
        estado: uf,
        qrToken: credenciadoSalvo.credencial?.qrToken ?? '',
        nomeEmpresa: setor || undefined,
      }
    : null

  // Tela de sucesso com download do PDF
  if (credenciadoSalvo && pdfUserData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/credenciados">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Credenciamento Realizado</h1>
            <p className="text-muted-foreground">Faça o download da credencial em PDF</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>✅ {credenciadoSalvo.nomeCompleto}</CardTitle>
            <CardDescription>
              Credenciamento salvo com sucesso. Baixe a credencial abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Gerando PDF...</>
                ) : (
                  <><Download className="mr-2 h-4 w-4" />Baixar Credencial PDF</>
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/credenciados">Ver lista de credenciados</Link>
              </Button>
              <Button variant="ghost" onClick={() => {
                setCredenciadoSalvo(null)
                setIsSaving(false)
                setNomeCompleto(''); setCpf(''); setRg(''); setEmail('')
                setCelular(''); setRua(''); setMunicipio(''); setUf('')
                setSetor(''); setDistanciaKm(''); setAceiteLgpd(false)
                setCategoria('')
              }}>
                Novo credenciamento
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* PDF oculto para geração */}
        <div className="hidden">
          <CredentialPDF
            ref={pdfRef}
            userData={pdfUserData}
            corTipo={corPorCategoria[credenciadoSalvo.tipoCategoria] ?? '#333'}
          />
        </div>
      </div>
    )
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
          <p className="text-muted-foreground">Cadastre um novo participante para o evento</p>
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
            <Select value={categoria} onValueChange={(v) => setCategoria(v as TipoCategoria)}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriasDisponiveis.map(({ value, label }) => (
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
                <Input id="nome" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} placeholder="Digite o nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input id="cpf" value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} placeholder="000.000.000-00" maxLength={14} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input id="rg" value={rg} onChange={(e) => setRg(e.target.value)} placeholder="RG (opcional)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular">Celular *</Label>
                <Input id="celular" value={celular} onChange={(e) => setCelular(formatCelular(e.target.value))} placeholder="(00) 00000-0000" maxLength={15} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setor / Função */}
        <Card>
          <CardHeader>
            <CardTitle>Setor / Função</CardTitle>
            <CardDescription>Área de atuação no evento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="setor">Setor ou Função</Label>
              <Input id="setor" value={setor} onChange={(e) => setSetor(e.target.value)} placeholder="Ex: Portaria, Logística, Coordenação..." />
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
                <Input id="rua" value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Rua, número (opcional)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipio">Município *</Label>
                <Input id="municipio" value={municipio} onChange={(e) => setMunicipio(e.target.value)} placeholder="Cidade" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">Estado (UF) *</Label>
                <Select value={uf} onValueChange={setUf}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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

        {/* Deslocamento */}
        <Card>
          <CardHeader>
            <CardTitle>Deslocamento</CardTitle>
            <CardDescription>Distância percorrida para cálculo de emissão de carbono</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="distancia">Distância até o evento (km)</Label>
              <Input
                id="distancia"
                type="number"
                min="0"
                value={distanciaKm}
                onChange={(e) => setDistanciaKm(e.target.value)}
                placeholder="Distância em km (opcional)"
              />
            </div>
          </CardContent>
        </Card>

        {/* LGPD */}
        <Card>
          <CardHeader>
            <CardTitle>Termo de Consentimento</CardTitle>
            <CardDescription>Lei Geral de Proteção de Dados (LGPD)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Checkbox id="lgpd" checked={aceiteLgpd} onCheckedChange={(checked) => setAceiteLgpd(checked as boolean)} />
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
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />Salvar Credenciamento</>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
