import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Scanner Portaria Alta Café',
    short_name: 'Portaria Café',
    description: 'Sistema de validação de ingressos e credenciais Alta Café',
    start_url: '/scanner/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#5D4037', // Tom de Café
    icons: [
      {
        src: '/scanner/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/scanner/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/scanner/icons/icon-round.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
