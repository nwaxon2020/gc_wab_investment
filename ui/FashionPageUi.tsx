// app/page.tsx
import FashionHeroSection from "@/components/fashion/FashionHero"
import ProductGrid from '@/components/fashion/ProductClothGrid'
import CartSidebar from '@/components/fashion/CartSidebar'
import FiltersSection from '@/components/fashion/FiltersSection'
import { products } from '@/components/fashion/Products'
import News from "@/components/News"

export default function ShopPageUi() {
    return (
        <>
            <main className="min-h-screen">
                <FashionHeroSection />
                <div className="">
                    <div><FiltersSection /></div>
                    <div className="px-1.5 md:px-6"><ProductGrid products={products} /></div>
                </div>
                <CartSidebar />
            </main>

            <News/>
        </>
    )
}