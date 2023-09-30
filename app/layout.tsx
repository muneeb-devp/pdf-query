import './globals.css'
import ReactQueryProvider from '@/components/ReactQueryProvider'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'PDF Query',
  description: 'An AI powered chat assistant to query any given PDF document',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <ReactQueryProvider>
        <html lang='en-us'>
          <body className={inter.className}>{children}</body>
          <Toaster position='top-right' toastOptions={{ duration: 5_000 }} />
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  )
}
