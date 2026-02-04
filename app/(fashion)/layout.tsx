// app/layout.tsx
import type { Metadata } from 'next'
import { CartProvider } from '@/components/fashion/CartContext' 


export const metadata: Metadata = {
  title: 'GC WAB FASHION BOUTIQUE - Premium Clothing Store',
  description: 'Clothing Store offering high-quality fashion items and accessories',
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