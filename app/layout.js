import Link from 'next/link';

export const metadata = {
  title: 'دليل العقارات الذكي',
  description: 'تصفح أفضل العقارات المحدثة يومياً',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', background: '#f4f7f6' }}>
        <nav style={{ padding: '15px 20px', background: '#fff', borderBottom: '2px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          {/* تم استبدال a بـ Link هنا لتوافق Next.js */}
          <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', textDecoration: 'none', color: '#007bff' }}>🏠 عقارات البرج</Link>
        </nav>

        {children}

        <footer style={{ marginTop: '50px', padding: '30px 20px', background: '#333', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px' }}>تواصل معنا</h3>
          <p>📍 العنوان: </p>
          <p>📞 هاتف: 01111174731</p>
          <div style={{ marginTop: '20px' }}>
            {/* الروابط الخارجية تبقى a كما هي */}
            <a href="https://wa.me/201111174731" target="_blank" style={{ color: '#25D366', textDecoration: 'none', margin: '0 10px' }}>واتساب</a> | 
            <a href="#" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>فيسبوك</a>
          </div>
          <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.7 }}>© 2026 جميع الحقوق محفوظة</p>
        </footer>
      </body>
    </html>
  )
}
