import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Comprehensive AI Development Platform',
  description: 'A complete AI-powered development environment with coding intelligence, testing automation, DevOps, collaboration, analytics, security, and advanced features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}