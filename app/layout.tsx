import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advanced Search System',
  description: 'A comprehensive TypeScript-based search engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}