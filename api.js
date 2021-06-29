const { default: Organization } = require("./pages/empresa/[code]/[slug]");

function buildRequester(base){
    const BASE_URL = `https://site-vagas.herokuapp.com/${ base }`;
    return BASE_URL
}

function headers(method="GET",itens=null){
    var header = new Headers();
    header.append('Bearer', process.env.API_BEARER_TOKEN);
    if (itens){
        for( let item of itens){
            header.append(item['name'], item['value']);
        }
    }
    return {
        method: method,
        headers: header
    }
}

module.exports.Organizations = {
    api: function(endpoint){
        const uri = buildRequester('organizations');
        return `${uri}/${endpoint}`
    },

    getSlugs: async function(){
        const resp = await fetch(this.api('slugs'), headers());
        const slugs = await resp.json();
        return slugs
    },

    getJobs: async function(code, slug){
        const resp = await fetch(this.api(`by-org/${code}/${slug}`), headers());
        const OrgAndJobs = await resp.json();
        return OrgAndJobs
    }
}

module.exports.Jobs = {
    api: function(endpoint){
        const uri = buildRequester('jobs');
        return `${uri}/${endpoint}`
    },

    getSlugs: async function(){
        const resp = await fetch(this.api('slugs'), headers());
        const slugs = await resp.json();
        return slugs
    },

    getJob: async function(code, slug){
        const resp = await fetch(this.api(`by-code/${code}/${slug}`), headers([{name: 'Method', value: "GET"}]));
        const Job = await resp.json();
        return Job
    }
}