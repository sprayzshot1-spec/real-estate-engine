import Link from 'next/link';

export const metadata = {
  title: 'Mr Broker',
  description: 'دليلك الأول للعقارات في مصر ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', background: '#f4f7f6' }}>
        
        {/* HEADER التعديل هنا */}
        <nav style={{ 
          padding: '10px 20px', 
          background: '#fff', 
          borderBottom: '2px solid #007bff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
        }}>
          
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            {/* إذا رفعت صورة باسم logo.png، قم بتفعيل السطر التالي واحذف نص البرج العقاري */}
            {/* <img src="/logo.png" alt="اللوجو" style={{ height: '50px' }} /> */}
            
            <span style={{ fontWeight: 'bold', fontSize: '1.6rem', color: '#007bff' }}>
              🏠 Mr Broker
            </span>
          </Link>

          <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'left' }}>
            <div>ماستر بروكر</div>
            <div style={{ fontWeight: 'bold', color: '#333' }}>01111174731</div>
          </div>
        </nav>

        {children}

        {/* FOOTER يمكنك تعديل أي معلومة خاطئة هنا أيضاً */}
        <footer style={{ marginTop: '50px', padding: '40px 20px', background: '#333', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px' }}>تواصل معنا</h3>
          <p>📍 Mr Broker</p>
          <p>📞 هاتف التواصل: 01111174731</p>
          <div style={{ marginTop: '20px' }}>
            <a href="https://wa.me/201111174731" target="_blank" style={{ color: '#25D366', textDecoration: 'none', margin: '0 15px', fontWeight: 'bold' }}>واتساب</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', margin: '0 15px', fontWeight: 'bold' }}>فيسبوك</a>
          </div>
          <p style={{ marginTop: '30px', fontSize: '0.8rem', opacity: 0.6 }}>© 2026 جميع الحقوق محفوظة Mr Broker</p>
        </footer>
      </body>
    </html>
  )
}
