import type { Metadata } from 'next'
import { Manrope, Maven_Pro, Bakbak_One } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const mavenPro = Maven_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-maven',
  display: 'swap',
})

const bakbakOne = Bakbak_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bakbak',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Blackmount — AI Aggregator',
  description:
    'Пробуй и сравнивай AI-модели — ChatGPT, Claude, Gemini, Flux, Sora, Kling, Veo, NanoBanana — через единый интерфейс.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${mavenPro.variable} ${bakbakOne.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-[family-name:var(--font-manrope)] text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}