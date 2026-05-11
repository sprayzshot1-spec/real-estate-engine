export default async function sitemap() {
  const baseUrl = 'https://properties.mrbrokereg.com';

  try {
    // إضافة التخزين المؤقت لمدة ساعة (3600 ثانية) لتخفيف الضغط ومنع أخطاء 5xx
    const res = await fetch('https://raw.githubusercontent.com/sprayzshot1-spec/properties3/main/properties.json', {
      next: { revalidate: 3600 } 
    });

    if (!res.ok) return [{ url: baseUrl, lastModified: new Date() }];

    const properties = await res.json();

    const propertyUrls = properties.map((p) => ({
      url: `${baseUrl}/property/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...propertyUrls,
    ];
  } catch (error) {
    console.error("Sitemap error:", error);
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}
