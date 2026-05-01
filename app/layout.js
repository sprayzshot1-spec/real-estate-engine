export const metadata = {
  title: 'دليل العقارات الذكي',
  description: 'تصفح أفضل العقارات المحدثة يومياً',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <nav style={{padding: '1rem', background: '#f8f9fa', borderBottom: '1px solid #ddd'}}>
          <a href="/" style={{fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', color: '#333'}}>🏠 عقاراتي</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
