'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomePage() {
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    
    // 1. تحديث متغيرات الفلاتر لتشمل الفلترين الجديدين (transactionType, hasVideo)
    const [filters, setFilters] = useState({ 
        searchID: '', type: '', compound: '', rooms: '', baths: '', 
        minPrice: '', maxPrice: '', minArea: '', maxArea: '', text: '', 
        locations: [], share: '', transactionType: '', hasVideo: '' 
    });
    
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
    const uniqueCompounds = [...new Set(allData.map(p => p.compound))].filter(Boolean);

    const handleLocationChange = (loc) => {
        setFilters(prev => {
            const newLocs = prev.locations.includes(loc)
                ? prev.locations.filter(l => l !== loc) 
                : [...prev.locations, loc]; 
            return { ...prev, locations: newLocs };
        });
    };

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
            if (filters.compound && p.compound !== filters.compound) return false;
            if (filters.rooms && p.rooms < parseInt(filters.rooms)) return false;
            if (filters.baths && p.baths < parseInt(filters.baths)) return false;
            
            const isShared = isPropertyShared(p.share);
            if (filters.share === 'yes' && !isShared) return false;
            if (filters.share === 'no' && isShared) return false;
            
            // 🎯 تطبيق فلتر نوع المعاملة الجديد (متاح / مطلوب)
            if (filters.transactionType && p.transaction_type !== filters.transactionType) return false;

            // 🎬 تطبيق فلتر الفيديو الجديد (عرض العقارات التي تحتوي على فيديو فقط)
            if (filters.hasVideo === 'yes' && !p.video) return false;
            
            return true;
        });
        setFilteredData(data);
        setCurrentPage(1);
        setIsLocationOpen(false); 
    };

    const resetFilters = () => {
        setFilters({ 
            searchID: '', type: '', compound: '', rooms: '', baths: '', 
            minPrice: '', maxPrice: '', minArea: '', maxArea: '', text: '', 
            locations: [], share: '', transactionType: '', hasVideo: '' 
        });
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

                <select value={filters.compound} onChange={e => setFilters({...filters, compound: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="">كل الكمبوندات</option>
                    {uniqueCompounds.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select value={filters.share} onChange={e => setFilters({...filters, share: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="">حالة المشاركة (الكل)</option>
                    <option value="yes">مشاركة فقط</option>
                    <option value="no">بدون مشاركة</option>
                </select>

                {/* 🎯 إضافة قائمة فلترة المطلوب والمعروض */}
                <select value={filters.transactionType} onChange={e => setFilters({...filters, transactionType: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontWeight: 'bold' }}>
                    <option value="">حالة العقار (معروض/مطلوب)</option>
                    <option value="available">🛒 المعروضات فقط</option>
                    <option value="required">🎯 الطلبات فقط (مطلوب)</option>
                </select>

                {/* 🎬 إضافة قائمة فلترة الفيديو */}
                <select value={filters.hasVideo} onChange={e => setFilters({...filters, hasVideo: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="">كل العقارات (بفيديو وبدون)</option>
                    <option value="yes">🎬 عقارات بالفيديو فقط</option>
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

                <select value={filters.rooms} onChange={e => setFilters({...filters, rooms: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="">الغرف (الكل)</option>
                    <option value="1">1+ غرفة</option>
                    <option value="2">2+ غرف</option>
                    <option value="3">3+ غرف</option>
                    <option value="4">4+ غرف</option>
                    <option value="5">5+ غرف</option>
                </select>

                <select value={filters.baths} onChange={e => setFilters({...filters, baths: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="">الحمامات (الكل)</option>
                    <option value="1">1+ حمام</option>
                    <option value="2">2+ حمام</option>
                    <option value="3">3+ حمام</option>
                    <option value="4">4+ حمام</option>
                    <option value="5">5+ حمام</option>
                </select>

                <input type="text" placeholder="بحث في الوصف..." value={filters.text} onChange={e => setFilters({...filters, text: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', flex: 1, minWidth: '150px' }} />
                
                <button onClick={applyFilters} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>🔍 بحث</button>
                <button onClick={resetFilters} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>🔄 ريست</button>
            </div>

            <p style={{fontWeight: 'bold', color: '#555', marginBottom: '15px'}}>إجمالي النتائج: {filteredData.length}</p>

            <div style={{ display: 'grid', gap: '20px' }}>
                {pageData.map(p => (
                    <div key={p.id} style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap:'15px' }}>
                        
                        {/* 🖼️ الحاوية الذكية لدمج الـ Thumbnail بجوار نصوص العقار بدقة */}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
                            
                            {/* عرض الصورة المصغرة إن وجدت سحابياً، أو وضع كارت بديل جذاب يحمل كود العقار */}
                            {p.thumbnail ? (
                                <img src={p.thumbnail} alt="Property Thumbnail" style={{ width: '130px', height: '95px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                            ) : (
                                <div style={{ width: '130px', height: '95px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', fontSize: '0.75rem', gap: '4px' }}>
                                    <span>🏢 لا توجد ميديا</span>
                                    <span style={{ fontSize: '0.65rem', background: '#e9ecef', padding: '2px 6px', borderRadius: '4px', color: '#495057' }}>ID: {p.id}</span>
                                </div>
                            )}

                            <div>
                                <h3 style={{ margin: '0 0 10px 0', color: '#333', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                    <span>{p.type} - {p.location}</span>
                                    
                                    {/* 🎯 علامة مميزة وواضحة جداً أمام كل عقار "مطلوب" */}
                                    {p.transaction_type === 'required' && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fff3cd', color: '#856404', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #ffeeba' }}>
                                            <span style={{ width: '8px', height: '8px', backgroundColor: '#dc3545', borderRadius: '50%' }}></span>
                                            🎯 مطلوب عاجل
                                        </span>
                                    )}

                                    {isPropertyShared(p.share) && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#e0f2ff', color: '#0056b3', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #b3d7ff' }}>
                                            <span style={{ width: '8px', height: '8px', backgroundColor: '#007bff', borderRadius: '50%' }}></span>
                                            مشاركة
                                        </span>
                                    )}

                                    {/* 🎬 إضافة أيقونة بصرية خفيفة إذا كان العقار يمتلك فيديو يوتيوب */}
                                    {p.video && (
                                        <span style={{ fontSize: '1.1rem' }} title="يحتوي على فيديو يوتيوب">🎬</span>
                                    )}
                                </h3>
                                <p style={{ margin: '5px 0', color: '#555' }}>💰 {p.price.toLocaleString()} ج.م | 📏 {p.area} م² {p.rooms > 0 && `| 🛏️ ${p.rooms} غرف`} {p.baths > 0 && `| 🛁 ${p.baths} حمام`}</p>
                                {p.compound && <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold' }}>🏘️ {p.compound}</p>}
                            </div>
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
