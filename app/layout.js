import { Analytics } from '@vercel/analytics/next'; // 1. أضف هذا في الأعلى

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <Analytics /> {/* 2. أضف هذا قبل إغلاق وسم body */}
      </body>
    </html>
  );
}

import Link from 'next/link';

export const metadata = {
  title: 'Mr Broker',
  description: 'دليلك الأول للعقارات في مصر ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* وسم التحقق من Google Search Console */}
        <meta name="google-site-verification" content="uKjx5M2o6tvYJ0gHhhZVcHiy25HNtUZZmMoDda6lmmA" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', background: '#f4f7f6' }}>
        
        {/* HEADER */}
        <nav style={{ 
          padding: '10px 20px', 
          background: '#fff', 
          borderBottom: '2px solid #007bff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
        }}>
          
          <a href="https://www.mrbrokereg.com/" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
            <img src="https://static.wixstatic.com/media/59f20f_8ffe43edd80f4ede995e885638e44762~mv2.jpg/v1/fill/w_104,h_78,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Copy2_adobe_express.jpg" alt="Mr Broker" style={{ height: '50px', objectFit: 'contain' }} />
            
            <span style={{ fontWeight: 'bold', fontSize: '1.6rem', color: '#007bff' }}>
              Mr Broker
            </span>
          </a>

          <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'left' }}>
            <div>ماستر بروكر</div>
            <div style={{ fontWeight: 'bold', color: '#333' }}>01111174731</div>
          </div>
        </nav>

        {children}

        {/* FOOTER */}
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

