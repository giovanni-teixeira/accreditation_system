import './globals.css'
import '../styles/variables.css'

export const metadata = {
  title: 'Cadastro - Alta Café',
  description: 'Sistema de credenciamento para a 6ª edição da feira Alta Café.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}
