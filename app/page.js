'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomePage() {
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    
    // ✅ أضفنا share هنا فقط
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

            // ✅ فلتر المشاركة
            if (filters.share === "yes" && !p.share) return false;
            if (filters.share === "no" && p.share) return false;

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

                {/* ✅ فلتر المشاركة الجديد */}
                <select value={filters.share} onChange={e => setFilters({...filters, share: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="">مشاركة / الكل</option>
                    <option value="yes">مشاركة فقط</option>
                    <option value="no">بدون مشاركة</option>
                </select>

                <div ref={dropdownRef} style={{ position: 'relative', minWidth: '150px' }}>
                    <div onClick={() => setIsLocationOpen(!isLocationOpen)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: filters.locations.length ? '#007bff' : '#555', fontWeight: filters.locations.length ? 'bold' : 'normal' }}>
                            {filters.locations.length > 0 ? `تم تحديد (${filters.locations.length}) مناطق` : 'اختر المناطق'}
                        </span>
                        <span>▼</span>
                    </div>

                    {isLocationOpen && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, left: 0, marginTop: '5px', background: '#fff', border: '1px solid #ddd', borderRadius: '5px', zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                            {uniqueLocations.map(loc => (
                                <label key={loc} style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                                    <input type="checkbox" checked={filters.locations.includes(loc)} onChange={() => handleLocationChange(loc)} />
                                    <span>{loc}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={applyFilters} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}>🔍 بحث</button>
                <button onClick={resetFilters} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px' }}>🔄 ريست</button>
            </div>

            <p>إجمالي النتائج: {filteredData.length}</p>

            <div style={{ display: 'grid', gap: '20px' }}>
                {pageData.map(p => (
                    <div key={p.id} style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ddd' }}>
                        
                        <h3>{p.type} - {p.location}</h3>
                        <p>💰 {p.price.toLocaleString()} ج.م | 📏 {p.area} م²</p>

                        {/* ✅ إظهار مشاركة */}
                        {p.share && (
                            <div style={{ color: '#007bff', fontWeight: 'bold' }}>
                                🔵 مشاركة
                            </div>
                        )}

                        <Link href={`/property/${p.id}`}>
                            عرض التفاصيل
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}
