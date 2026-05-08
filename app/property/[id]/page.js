import Link from 'next/link';

// الدالة الذكية لمعالجة قيم المشاركة
const isPropertyShared = (shareValue) => {
    if (!shareValue) return false; 
    
    if (typeof shareValue === 'string') {
        const val = shareValue.trim().toLowerCase();
        if (val === 'false' || val === 'no' || val === '0' || val === 'لا' || val === 'بدون' || val === 'nan' || val === 'null') {
            return false;
        }
    }
    return true; 
};

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
    const { id } = await params;
    const res = await fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json', { cache: 'no-store' });
    const properties = await res.json();
    const property = properties.find(p => p.id.toString() === id);

    if (!property) return <div style={{ textAlign: 'center', padding: '50px' }}>العقار غير موجود</div>;

    return (
        <main style={{ padding: '20px', maxWidth: '900px', margin: 'auto', background: '#fff', marginTop: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', direction: 'rtl' }}>
            
            <div style={{ marginBottom: '15px' }}>
                <Link href="/" style={{textDecoration: 'none', color: '#007bff', fontWeight: 'bold'}}>← العودة للرئيسية</Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#2c3e50', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <span>{property.type}</span>
                        
                        {/* علامة المشاركة */}
                        {isPropertyShared(property.share) && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0f2ff', color: '#0056b3', padding: '6px 16px', borderRadius: '25px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid #b3d7ff' }}>
                                <span style={{ width: '8px', height: '8px', backgroundColor: '#007bff', borderRadius: '50%' }}></span>
                                مشاركة
                            </span>
                        )}

                        {/* علامة الكمبوند - تظهر فقط إذا كان الحقل يحتوي على بيانات */}
                        {property.compound && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e6fffa', color: '#008b8b', padding: '6px 16px', borderRadius: '25px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid #b2f5ea' }}>
                                <span style={{ width: '8px', height: '8px', backgroundColor: '#008b8b', borderRadius: '50%' }}></span>
                                كمبوند: {property.compound}
                            </span>
                        )}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#666', margin: '10px 0 5px 0' }}>📍 {property.location}</p>
                </div>
                <div style={{ background: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    ID: {property.id}
                </div>
            </div>

            {/* قسم ملخص البيانات - المساحة، السعر، الغرف، الحمامات */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <span style={{ display: 'block', color: '#888' }}>المساحة</span>
                    <strong style={{ fontSize: '1.3rem' }}>📏 {property.area} م²</strong>
                </div>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <span style={{ display: 'block', color: '#888' }}>السعر</span>
                    <strong style={{ fontSize: '1.3rem', color: '#28a745' }}>💰 {property.price.toLocaleString()} ج.م</strong>
                </div>
                
                {/* إظهار الغرف فقط إذا كانت أكبر من 0 */}
                {property.rooms > 0 && (
                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                        <span style={{ display: 'block', color: '#888' }}>الغرف</span>
                        <strong style={{ fontSize: '1.3rem' }}>🛏️ {property.rooms}</strong>
                    </div>
                )}

                {/* إظهار الحمامات فقط إذا كانت أكبر من 0 */}
                {property.baths > 0 && (
                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                        <span style={{ display: 'block', color: '#888' }}>الحمامات</span>
                        <strong style={{ fontSize: '1.3rem' }}>🛁 {property.baths}</strong>
                    </div>
                )}
            </div>

            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.1rem', color: '#444', marginBottom: '20px' }}>
                {property.description}
            </div>

            {/* زر الواتساب الذكي */}
            <div style={{ marginBottom: '30px' }}>
                <a 
                    href={`https://wa.me/201111174731?text=${encodeURIComponent(`مرحباً، أستفسر عن العقار رقم: ${property.id} - ${property.type} في ${property.location}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                        display: 'block', 
                        textAlign: 'center',
                        padding: '15px', 
                        background: '#25D366', 
                        color: '#fff', 
                        textDecoration: 'none', 
                        borderRadius: '8px', 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    📞 تواصل واتساب بخصوص هذا العقار
                </a>
            </div>

            {property.video && property.video.startsWith('http') && (
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                    <a href={property.video} target="_blank" style={{
                        padding: '15px 40px',
                        background: '#e91e63',
                        color: 'white',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(233, 30, 99, 0.3)'
                    }}>
                        🎥 مشاهدة الفيديو أو الصور
                    </a>
                </div>
            )}
        </main>
    );
}
