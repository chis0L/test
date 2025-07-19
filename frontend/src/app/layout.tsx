import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ApolloProviderClient from './ApolloProviderClient';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Employee Management',
  description: 'Система управления сотрудниками',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ApolloProviderClient>
          {children}
        </ApolloProviderClient>
      </body>
    </html>
  )
}
