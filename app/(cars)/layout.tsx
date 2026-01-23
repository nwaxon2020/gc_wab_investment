import { Inter } from 'next/font/google'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Premium Car Showcase',
  description: 'Discover the world\'s most exclusive supercars',
}

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>)  {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        {children}
      </body>
    </html>
  )
}