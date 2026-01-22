import { NextResponse } from 'next/server'

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY

if (!NEWS_API_KEY) {
  throw new Error('Please set NEWS_API_KEY in .env.local')
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || 'cars,fashion'
    const country = 'ng'

    // Step 1: Try Nigeria news first with strict pageSize limit
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&q=${encodeURIComponent(
      query
    )}&pageSize=8&apiKey=${NEWS_API_KEY}`

    let res = await fetch(url)
    let data = await res.json()

    // Step 2: Fallback to worldwide if Nigeria has no articles
    if (!data.articles || data.articles.length === 0) {
      // For 'everything' endpoint, we slice the array to exactly 8
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&sortBy=publishedAt&language=en&pageSize=12&apiKey=${NEWS_API_KEY}`
      
      res = await fetch(url)
      data = await res.json()
      
      // Force limit to 8 after fetching fallback
      if (data.articles) {
        data.articles = data.articles.slice(0, 8)
      }
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch news' },
      { status: 500 }
    )
  }
}