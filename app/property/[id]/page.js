export async function generateStaticParams() {
    const res = await fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json');
    const properties = await res.json();
    return properties.map((p) => ({
        id: p.id.toString(),
    }));
}

export async function generateMetadata({ params }) {
    const res = await fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json');
    const properties = await res.json();
    const property = properties.find(p => p.id.toString() === params.id);
    
    if (!property) return { title: 'عقار غير موجود' };
    
    return {
        title: `${property.type} في ${property.location} | كود ${property.id}`,
        description: property.description.substring(0, 160),
    };
}

export default async function PropertyPage({ params }) {
    const res = await fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json');
    const properties = await res.json();
    const property = properties.find(p => p.id.toString() === params.id);

    if (!property) return <div style={{padding: '50px', textAlign: 'center'}}>عذراً، هذا العقار غير متاح حالياً.</div>;

    return (
        <main style={{padding: '20px', maxWidth: '800px', margin: 'auto', lineHeight: '1.6'}}>
            <h1 style={{color: '#2c3e50'}}>{property.type} في {property.location}</h1>
            <div style={{display: 'flex', gap: '20px', background: '#fdfdfd', padding: '15px', borderRadius: '8px', border: '1px solid #eee'}}>
                <p><strong>المساحة:</strong> {property.area} م²</p>
                <p><strong>السعر:</strong> {property.price.toLocaleString()} ج.م</p>
            </div>
            <div style={{marginTop: '30px', whiteSpace: 'pre-wrap', fontSize: '1.1rem'}}>
                {property.description}
            </div>
            <hr style={{marginTop: '40px', borderColor: '#eee'}} />
            <p style={{fontSize: '0.9rem', color: '#777'}}>تاريخ النشر: {property.date}</p>
        </main>
    );
}
