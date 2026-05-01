export async function generateStaticParams() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json', { next: { revalidate: 60 } });
        const properties = await res.json();
        return properties.map((p) => ({
            id: p.id.toString(),
        }));
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }) {
    // في النسخ الجديدة يجب انتظار params
    const { id } = await params;
    
    const res = await fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json');
    const properties = await res.json();
    const property = properties.find(p => p.id.toString() === id);
    
    if (!property) return { title: 'عقار غير موجود' };
    
    return {
        title: `${property.type} في ${property.location} | كود ${property.id}`,
        description: property.description.substring(0, 160),
    };
}

export default async function PropertyPage({ params }) {
    // السطر الأهم لحل المشكلة في التحديث الجديد
    const { id } = await params;

    const res = await fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json', { cache: 'no-store' });
    const properties = await res.json();
    
    // البحث عن العقار باستخدام الـ id بعد انتظاره
    const property = properties.find(p => p.id.toString() === id);

    if (!property) return (
        <div style={{padding: '50px', textAlign: 'center'}}>
            <h2>عذراً، هذا العقار غير متاح حالياً.</h2>
            <p>المعرف المطلوب: {id}</p>
            <a href="/">العودة للرئيسية</a>
        </div>
    );

    return (
        <main style={{padding: '20px', maxWidth: '800px', margin: 'auto', lineHeight: '1.6', direction: 'rtl'}}>
            <a href="/" style={{textDecoration: 'none', color: '#0070f3'}}>← العودة للقائمة</a>
            <h1 style={{color: '#2c3e50', marginTop: '20px'}}>{property.type} في {property.location}</h1>
            
            <div style={{display: 'flex', gap: '20px', background: '#fdfdfd', padding: '15px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '20px'}}>
                <p><strong>المساحة:</strong> {property.area} م²</p>
                <p><strong>السعر:</strong> {property.price.toLocaleString()} ج.م</p>
                <p><strong>الكود:</strong> {property.id}</p>
            </div>

            <div style={{background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #eee', whiteSpace: 'pre-wrap', fontSize: '1.1rem'}}>
                {property.description}
            </div>

            <footer style={{marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee', color: '#777', fontSize: '0.9rem'}}>
                تاريخ النشر: {property.date}
            </footer>
        </main>
    );
}
