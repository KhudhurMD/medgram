import { serverApi } from '../utils/serverapi';

function generateSiteMap(slugs: string[]) {
  const staticPages = ['', 'about', 'contribute', 'policies'];
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map((page) => {
    return `<url>
  <loc>https://medgram.net/${page}</loc>
</url>`;
  })
  .join('')}

     ${slugs
       .map((slug) => {
         return `
       <url>
           <loc>${`https://medgram.net/algorithm/${slug}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const slugs = await serverApi.publicGraphs.getAllSlugs.fetch();
  const slugsArr = slugs.map((slug) => slug.slug);

  const sitemap = generateSiteMap(slugsArr);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
