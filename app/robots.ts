import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // 優先使用環境變數，否則使用 Vercel 提供的 URL，最後使用默認值
  const baseUrl = 
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-domain.com')
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
