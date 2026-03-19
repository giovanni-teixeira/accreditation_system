import type { Metadata, Viewport } from 'next'
import { DM_Sans, Libre_Baskerville } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap',
})

const libreBaskerville = Libre_Baskerville({ 
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-libre-baskerville',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Painel Administrativo | Alta Café',
  description: 'Gestão de credenciamento, credenciais e operação de acesso - Alta Café',

  icons: {
    icon: '/admin/ico_alta-cafe.png', // Caminho considerando que o arquivo está na pasta public/
    apple: '/apple-touch-icon.png', // Opcional: ícone para dispositivos Apple
  },
}

export const viewport: Viewport = {
  themeColor: '#119447',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${libreBaskerville.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
