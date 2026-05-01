export default async function HomePage() {
    // استخدام الرابط الخام المباشر من GitHub
    const res = await fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json', { cache: 'no-store' });
    const properties = await res.json();

    return (
        <main style={{padding: '20px', maxWidth: '1200px', margin: 'auto', fontFamily: 'Arial'}}>
            <h1 style={{textAlign: 'center', color: '#2c3e50', marginBottom: '30px'}}>🏠 أحدث العقارات المتاحة</h1>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                {properties.map(property => (
                    <div key={property.id} style={{border: '1px solid #ddd', padding: '20px', borderRadius: '10px', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                        <h3 style={{marginTop: '0', color: '#0070f3'}}>{property.type}</h3>
                        <p style={{margin: '5px 0', color: '#555'}}><strong>📍 المنطقة:</strong> {property.location}</p>
                        <p style={{margin: '5px 0', color: '#555'}}><strong>💰 السعر:</strong> {property.price.toLocaleString()} ج.م</p>
                        
                        <a href={`/property/${property.id}`} style={{display: 'block', textAlign: 'center', marginTop: '15px', background: '#0070f3', color: 'white', padding: '10px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold'}}>
                            عرض التفاصيل
                        </a>
                    </div>
                ))}
            </div>
        </main>
    );
}
