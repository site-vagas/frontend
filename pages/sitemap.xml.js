import { Jobs as JobsAPI, Organizations as OrganizationsAPI } from '../api';

function Sitemap() {};

export async function getServerSideProps({ res }){

    const jobs = await JobsAPI.getSlugs();
    const organizations = await OrganizationsAPI.getSlugs();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${
            jobs.map( (job) => (
                `<url>
                    <loc>https://tickun.com.br/vaga/${job.code}/${job.slug}</loc>
                    <lastmod>2018-06-04</lastmod>
                </url>`
            ))
        }
        
        ${
            organizations.map( (organization) => (
                `<url>
                    <loc>https://tickun.com.br/empresa/${organization.code}/${organization.slug}</loc>
                    <lastmod>2018-06-04</lastmod>
                </url>`
            ))
        }
    </urlset>`;
    
    res.writeHead(200, {
        "Content-Type": "application/xml"
    });
    res.write(sitemap);
    res.end();
  
    return {
      props: {},
    };
}

export default Sitemap