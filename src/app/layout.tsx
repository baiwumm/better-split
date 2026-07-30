import './globals.css'

import { Toast } from '@heroui/react'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

import BackTop from '@/components/BackTop'
import FullLoading from '@/components/FullLoading'
import pkg from '#/package.json'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - ${process.env.NEXT_PUBLIC_APP_TITLE}`,
  description: process.env.NEXT_PUBLIC_APP_DESC,
  applicationName: process.env.NEXT_PUBLIC_APP_NAME, // 应用名称
  authors: { name: pkg.author.name, url: pkg.author.url },
  keywords: process.env.NEXT_PUBLIC_APP_KEYWORDS,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og.png`],
    creator: pkg.author.name,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content={process.env.NEXT_PUBLIC_APP_NAME} />
        <link href="https://cdn.baiwumm.com/fonts/MapleMono-CN-Regular/result.css" rel="stylesheet" />
        <Analytics />
      </head>
      <body className="bg-background text-foreground">
        <NextThemesProvider attribute="class">
          <FullLoading>
            {children}
          </FullLoading>
          <BackTop />
          <Toast.Provider placement="top" />
        </NextThemesProvider>
      </body>
    </html>
  )
}
