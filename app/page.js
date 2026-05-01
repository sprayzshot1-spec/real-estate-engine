'use client';
import { useState, useEffect } from 'react';

export default function HomePage() {
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ searchID: '', type: '', minPrice: '', maxPrice: '', minArea: '', maxArea: '', text: '' });
    const perPage = 10;

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json')
            .then(res => res.json())
            .then(data => {
                setAllData(data);
                setFilteredData(data);
            });
    }, []);

    const applyFilters = () => {
        let data = allData.filter(p => {
            if (filters.searchID && p.id != filters.searchID) return false;
            if (filters.type && p.type !== filters.type) return false;
            if (filters.minPrice && p.price < filters.minPrice) return false;
            if (filters.maxPrice && p.price > filters.maxPrice) return false;
            if (filters.minArea && p.area < filters.minArea) return false;
            if (filters.maxArea && p.area > filters.maxArea) return false;
            if (filters.text && !p.description.includes(filters.text)) return false;
            return true;
        });
        setFilteredData(data);
        setCurrentPage(1);
    };

    const start = (currentPage - 1) * perPage;
    const pageData = filteredData.slice(start, start + perPage);
    const totalPages = Math.ceil(filteredData.length / perPage);

    return (
        <main style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            {/* شريط الفلاتر */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <input type="number" placeholder="رقم الكود" onChange={e => setFilters({...filters, searchID: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
                <select onChange={e => setFilters({...filters, type: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="">كل الأنواع</option>
                    {[...new Set(allData.map(p => p.type))].map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="number" placeholder="من سعر" onChange={e => setFilters({...filters, minPrice: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100px' }} />
                <input type="number" placeholder="إلى سعر" onChange={e => setFilters({...filters, maxPrice: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100px' }} />
                <input type="text" placeholder="بحث في النص" onChange={e => setFilters({...filters, text: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', flex: 1 }} />
                <button onClick={applyFilters} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🔍 بحث</button>
                <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🔄 ريست</button>
            </div>

            <p>إجمالي النتائج: {filteredData.length}</p>

            {/* عرض العقارات */}
            <div style={{ display: 'grid', gap: '20px' }}>
                {pageData.map(p => (
                    <div key={p.id} style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{p.type} - {p.location}</h3>
                            <p style={{ margin: '5px 0' }}>💰 {p.price.toLocaleString()} ج.م | 📏 {p.area} م²</p>
                        </div>
                        <a href={`/property/${p.id}`} style={{ padding: '10px 20px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>عرض التفاصيل</a>
                    </div>
                ))}
            </div>

            {/* التقسيم Pagination */}
            <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '10px', background: currentPage === page ? '#007bff' : '#eee', color: currentPage === page ? '#fff' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {page}
                    </button>
                ))}
            </div>
        </main>
    );
}
