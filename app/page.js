'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomePage() {
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [filters, setFilters] = useState({ searchID: '', type: '', minPrice: '', maxPrice: '', minArea: '', maxArea: '', text: '', locations: [], share: '' });
    
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const dropdownRef = useRef(null);
    
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLocationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const uniqueLocations = [...new Set(allData.map(p => p.location))].filter(Boolean);

    const handleLocationChange = (loc) => {
        setFilters(prev => {
            const newLocs = prev.locations.includes(loc)
                ? prev.locations.filter(l => l !== loc) 
                : [...prev.locations, loc]; 
            return { ...prev, locations: newLocs };
        });
    };

    // --- الدالة الذكية الجديدة للتعامل مع مخرجات بايثون/إكسل ---
    const isPropertyShared = (shareValue) => {
        if (!shareValue) return false; // يلتقط القيم الفارغة و null و undefined و 0 و false
        
        if (typeof shareValue === 'string') {
            const val = shareValue.trim().toLowerCase();
            // الكلمات السلبية التي يولدها بايثون للخانات الفارغة في إكسل
            if (val === 'false' || val === 'no' || val === '0' || val === 'لا' || val === 'بدون' || val === 'nan' || val === 'null') {
                return false;
            }
        }
        return true; // إذا تجاوز الشروط السابقة، فهو حتماً "مشاركة"
    };

    const applyFilters = () => {
        let data = allData.filter(p => {
            if (filters.searchID && p.id != filters.searchID) return false;
            if (filters.type && p.type !== filters.type) return false;
            if (filters.minPrice && p.price < filters.minPrice) return false;
            if (filters.maxPrice && p.price > filters.maxPrice) return false;
            if (filters.minArea && p.area < filters.minArea) return false;
            if (filters.maxArea && p.area > filters.maxArea) return false;
            if (filters.text && !p.description.includes(filters.text)) return false;
            
            if (filters.locations.length > 0 && !filters.locations.includes(p.location)) return false;
            
            // فلترة المشاركة بالاعتماد على الدالة الذكية
            const isShared = isPropertyShared(p.share);
            if (filters.share === 'yes' && !isShared) return false;
            if (filters.share === 'no' && isShared) return false;
            
            return true;
        });
        setFilteredData(data);
        setCurrentPage(1);
        setIsLocationOpen(false); 
    };

    const resetFilters = () => {
        setFilters({ searchID: '', type: '', minPrice: '', maxPrice: '', minArea: '', maxArea: '', text: '', locations: [], share: '' });
        setFilteredData(allData);
        setCurrentPage(1);
    };

    const start = (currentPage - 1) * perPage;
    const pageData = filteredData.slice(start, start + perPage);
    const totalPages = Math.ceil(filteredData.length / perPage);

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
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                
                <input type="number" placeholder="رقم الكود" value={filters.searchID} onChange={e => setFilters({...filters, searchID: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '90px' }} />
                
                <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="">كل الأنواع</option>
                    {[...new Set(allData.map(p => p.type))].map(t => <option key={t}>{t}</option>)}
                </select>

                <select value={filters.share} onChange={e => setFilters({...filters, share: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="">حالة المشاركة (الكل)</option>
                    <option value="yes">مشاركة فقط</option>
                    <option value="no">بدون مشاركة</option>
                </select>

                <div ref={dropdownRef} style={{ position: 'relative', minWidth: '150px' }}>
                    <div 
                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <span style={{ fontSize: '0.9rem', color: filters.locations.length ? '#007bff' : '#555', fontWeight: filters.locations.length ? 'bold' : 'normal' }}>
                            {filters.locations.length > 0 ? `تم تحديد (${filters.locations.length}) مناطق` : 'اختر المناطق'}
                        </span>
                        <span style={{ fontSize: '0.8rem', marginLeft: '5px' }}>▼</span>
                    </div>
                    
                    {isLocationOpen && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, left: 0, marginTop: '5px', background: '#fff', border: '1px solid #ddd', borderRadius: '5px', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            {uniqueLocations.map(loc => (
                                <label key={loc} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer', margin: 0 }}>
                                    <input
                                        type="checkbox"
                                        checked={filters.locations.includes(loc)}
                                        onChange={() => handleLocationChange(loc)}
                                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.9rem', color: '#333' }}>{loc}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <input type="number" placeholder="من سعر" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100px' }} />
                <input type="number" placeholder="إلى سعر" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100px' }} />
                
                <input type="number" placeholder="من مساحة" value={filters.minArea} onChange={e => setFilters({...filters, minArea: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100px' }} />
                <input type="number" placeholder="إلى مساحة" value={filters.maxArea} onChange={e => setFilters({...filters, maxArea: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100px' }} />

                <input type="text" placeholder="بحث في الوصف..." value={filters.text} onChange={e => setFilters({...filters, text: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', flex: 1, minWidth: '150px' }} />
                
                <button onClick={applyFilters} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>🔍 بحث</button>
                <button onClick={resetFilters} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>🔄 ريست</button>
            </div>

            <p style={{fontWeight: 'bold', color: '#555', marginBottom: '15px'}}>إجمالي النتائج: {filteredData.length}</p>

            <div style={{ display: 'grid', gap: '20px' }}>
                {pageData.map(p => (
                    <div key={p.id} style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap:'15px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0', color: '#333', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <span>{p.type} - {p.location}</span>
                                
                                {/* إظهار علامة المشاركة باستخدام الدالة الذكية */}
                                {isPropertyShared(p.share) && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#e0f2ff', color: '#0056b3', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #b3d7ff' }}>
                                        <span style={{ width: '8px', height: '8px', backgroundColor: '#007bff', borderRadius: '50%' }}></span>
                                        مشاركة
                                    </span>
                                )}
                            </h3>
                            <p style={{ margin: '5px 0', color: '#555' }}>💰 {p.price.toLocaleString()} ج.م | 📏 {p.area} م²</p>
                        </div>
                        <Link href={`/property/${p.id}`} style={{ padding: '10px 20px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                            عرض التفاصيل
                        </Link>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div style={{ marginTop: '40px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', flexWrap: 'wrap', direction: 'rtl' }}>
                    
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                        style={{ padding: '10px 15px', background: currentPage === 1 ? '#ddd' : '#eee', color: currentPage === 1 ? '#999' : '#333', border: 'none', borderRadius: '5px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                        ⬅ السابق
                    </button>

                    {visiblePages.map(page => (
                        <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '10px 15px', background: currentPage === page ? '#007bff' : '#eee', color: currentPage === page ? '#fff' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {page}
                        </button>
                    ))}

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
