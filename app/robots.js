export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://properties.mrbrokereg.com/sitemap.xml',
  }
}
