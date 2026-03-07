import './globals.css'

export const metadata = {
  title: 'Cadastro - Alta Café',
  description: 'Sistema de credenciamento para a 6ª edição da feira Alta Café.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}
