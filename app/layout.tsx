import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Portfolio Builder - Create Your Professional Portfolio in Minutes',
  description: 'Build a stunning AI-powered portfolio website that showcases your skills and experience. Perfect for data scientists, AI engineers, and tech professionals.',
  keywords: 'AI portfolio, portfolio builder, data science portfolio, tech resume, AI resume builder',
  authors: [{ name: 'Matthew Rundle' }],
  openGraph: {
    title: 'AI Portfolio Builder',
    description: 'Build your professional portfolio in minutes with AI',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  )
}