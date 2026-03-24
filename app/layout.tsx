import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/cart-context'
import { ProductsProvider } from '@/context/products-context'
import { OrderProvider } from '@/context/order-context'
import { AuthProvider } from '@/context/auth-context'
import { Header } from '@/components/header'
import './globals.css'

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'Домашняя Кухня | Вкусная домашняя еда',
  description: 'Домашняя еда с любовью. Заказывайте пельмени, борщ, котлеты и другие блюда домашней кухни с доставкой.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {/* AuthProvider оборачивает весь проект, чтобы useAuth() работал в любом компоненте */}
        <AuthProvider>
          <ProductsProvider>
            <OrderProvider>
              <CartProvider>
                <Header />
                <main className="min-h-screen">
                  {children}
                </main>
              </CartProvider>
            </OrderProvider>
          </ProductsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
