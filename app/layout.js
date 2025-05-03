// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/footer'
import { CartProvider } from './contexts/CartContexts'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ShopNext - Your Online Store',
  description: 'Find the best products at the best prices',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}