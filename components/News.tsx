'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation' // 🔥 Added this

interface Article {
  title: string
  description: string
  url: string
  urlToImage: string | null
  source: { name: string }
  publishedAt: string
}

interface NewsProps {
  category?: 'cars' | 'fashion' // Made optional because we will detect it
}

export default function News({ category: propCategory }: NewsProps) {
  const pathname = usePathname()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔥 LOGIC: Detect category from URL or use the passed prop
  const activeCategory = pathname.includes('car') 
    ? 'cars' 
    : pathname.includes('shop') 
    ? 'fashion' 
    : propCategory || 'cars'

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`/api/news?q=${activeCategory}`)
      .then(res => res.json())
      .then(data => {
        if (data.articles) {
          const filtered = data.articles
            .filter((a: Article) => a.urlToImage && a.description)
            .slice(0, 8) 
          setArticles(filtered)
        } else {
          setError('No articles found')
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [activeCategory]) // 🔥 Re-run when category changes

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#16a34a]/10 border-t-[#16a34a] rounded-full animate-spin"></div>
    </div>
  )
  
  if (error) return <div className="text-center py-10 text-xs font-bold text-red-500 uppercase">{error}</div>

  return (
    <div className="container mx-auto px-4 py-12">
      
      {/* HEADER SECTION */}
      <div className="mb-12 flex flex-col items-center md:items-start text-center md:text-left border-l-0 md:border-l-4 border-[#16a34a] md:pl-6">
        <div className="block md:hidden w-12 h-1 bg-[#16a34a] mb-4 rounded-full"></div>
        <h2 className="text-[10px] font-black text-[#16a34a] uppercase tracking-[0.4em] mb-2">Global Updates</h2>
        <h3 className="text-3xl font-bold text-[#14532d] capitalize">Latest in {activeCategory}</h3>
      </div>

      {/* 4-COLUMN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {articles.map((article, idx) => (
          <a
            href={article.url}
            key={idx}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
          >
            <div className="relative h-36 overflow-hidden">
              <img 
                src={article.urlToImage!} 
                alt={article.title} 
                loading="lazy"
                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transform group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute top-3 left-3">
                <span className="bg-[#14532d]/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[7px] font-black text-white uppercase tracking-tighter">
                  {article.source.name}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-[13px] text-[#14532d] mb-2 line-clamp-2 group-hover:text-[#16a34a] transition-colors leading-tight">
                {article.title}
              </h3>
              <p className="text-[11px] text-gray-500 line-clamp-2 mb-3 font-medium leading-relaxed overflow-hidden">
                {article.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                <span className="text-[8px] font-bold text-gray-300 uppercase">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <i className="fas fa-external-link-alt text-[9px] text-[#16a34a] opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}