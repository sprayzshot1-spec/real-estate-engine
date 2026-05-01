export default async function sitemap() {
  const baseUrl = 'https://properties.mrbrokereg.com';

  // جلب البيانات من ملفك الخارجي ليعرف جوجل كل العقارات المتاحة
  const res = await fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json');
  const properties = await res.json();

  // تحويل كل عقار إلى رابط يفهمه جوجل
  const propertyUrls = properties.map((p) => ({
    url: `${baseUrl}/property/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // الروابط الأساسية للموقع
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...propertyUrls,
  ];
}
