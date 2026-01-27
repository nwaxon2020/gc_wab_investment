// app/layout.tsx
import type { Metadata } from 'next'
import { CartProvider } from '@/components/fashion/CartContext' 


export const metadata: Metadata = {
  title: 'Fashion Boutique',
  description: 'Premium Clothing Store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  
    <section >
      <CartProvider> 
        {children}
      </CartProvider>
    </section>
   
  )
}