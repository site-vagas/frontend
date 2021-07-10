function Robots() {};

export async function getServerSideProps({ res }){

    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });
    res.write(`
        User-agent: *
        Allow: /
        Sitemap: https://www.tickun.com.br/sitemap.xml
    `);
    res.end();
  
    return {
      props: {},
    };
}

export default Robots