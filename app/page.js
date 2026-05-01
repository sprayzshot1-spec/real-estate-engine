'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
            })
            .catch(err => console.error("Error fetching data:", err));
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

    const resetFilters = () => {
        setFilters({ searchID: '', type: '', minPrice: '', maxPrice: '', minArea: '', maxArea: '', text: '' });
        setFilteredData(allData);
        setCurrentPage(1);
    };

    const start = (currentPage - 1) * perPage;
    const pageData = filteredData.slice(start, start + perPage);
    const totalPages = Math.ceil(filteredData.length / perPage);

    // --- هندسة الترقيم (Pagination Logic) ---
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
        if (i >= 1 && i <= totalPages) {
            visiblePages.push(i);
        }
    }

    return (
        <main style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            {/* شريط الفلاتر */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <input type="number" placeholder="رقم الكود" value={filters.searchID} onChange={e => setFilters({...filters, searchID: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
                <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="">كل الأنواع</option>
                    {[...new Set(allData.map(p => p.type))].map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="number" placeholder="من سعر" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100px' }} />
                <input type="number" placeholder="إلى سعر" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100px' }} />
                
                {/* إضافة فلاتر المساحة التي كانت ناقصة */}
                <input type="number" placeholder="من مساحة" value={filters.minArea} onChange={e => setFilters({...filters, minArea: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100px' }} />
                <input type="number" placeholder="إلى مساحة" value={filters.maxArea} onChange={e => setFilters({...filters, maxArea: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100px' }} />

                <input type="text" placeholder="بحث في النص" value={filters.text} onChange={e => setFilters({...filters, text: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', flex: 1 }} />
                <button onClick={applyFilters} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🔍 بحث</button>
                <button onClick={resetFilters} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🔄 ريست</button>
            </div>

            <p style={{fontWeight: 'bold', color: '#555'}}>إجمالي النتائج: {filteredData.length}</p>

            {/* عرض العقارات */}
            <div style={{ display: 'grid', gap: '20px' }}>
                {pageData.map(p => (
                    <div key={p.id} style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap:'15px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{p.type} - {p.location}</h3>
                            <p style={{ margin: '5px 0' }}>💰 {p.price.toLocaleString()} ج.م | 📏 {p.area} م²</p>
                        </div>
                        <Link href={`/property/${p.id}`} style={{ padding: '10px 20px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                            عرض التفاصيل
                        </Link>
                    </div>
                ))}
            </div>

            {/* التقسيم Pagination الجديد */}
            {totalPages > 1 && (
                <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', flexWrap: 'wrap', direction: 'rtl' }}>
                    
                    {/* زر السابق */}
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                        style={{ padding: '10px 15px', background: currentPage === 1 ? '#ddd' : '#eee', color: currentPage === 1 ? '#999' : '#333', border: 'none', borderRadius: '5px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                        ⬅ السابق
                    </button>

                    {/* أرقام الصفحات (5 فقط) */}
                    {visiblePages.map(page => (
                        <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '10px 15px', background: currentPage === page ? '#007bff' : '#eee', color: currentPage === page ? '#fff' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {page}
                        </button>
                    ))}

                    {/* زر التالي */}
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                        style={{ padding: '10px 15px', background: currentPage === totalPages ? '#ddd' : '#eee', color: currentPage === totalPages ? '#999' : '#333', border: 'none', borderRadius: '5px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                        التالي ➡
                    </button>
                </div>
            )}
        </main>
    );
}
