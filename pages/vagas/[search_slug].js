import { useRouter } from 'next/router';
import JobsManager from '../../components/jobs/JobsManager';
import PageHeader from '../../components/general/PageHeader';
import styles from './../../styles/SearchResults.module.scss';

function Jobs({ jobs }) {

    const router = useRouter();

    if ( router.isFallback ) { return <>Carregando...</> }
    return (
        <div className={ styles.SearchResults }>
        
            <PageHeader />

            <JobsManager
                jobs={ jobs }
                filters={[
                    'state','city','organization','benefit',
                    'type','role','category','subCategory'
                ]}
                replacers={{}}
            />
        </div>
    )
}

export async function getStaticPaths(){
    const paths = [{params: { search_slug: "vagas-em-brasil" }}];
    return { paths, fallback: true }
}

export async function getStaticProps({ params }){
    var state = undefined;
    var city = undefined;
    var query = undefined;
    var jobs = [];    
    const states = [
        "rondonia",
        "acre",
        "amazonas",
        "roraima",
        "para",
        "amapa",
        "tocantins",
        "maranhao",
        "piaui",
        "ceara",
        "rio-grande-do-norte",
        "paraiba",
        "pernambuco",
        "alagoas",
        "sergipe",
        "bahia",
        "minas-gerais",
        "espirito-santo",
        "rio-de-janeiro",
        "sao-paulo",
        "parana",
        "santa-catarina",
        "rio-grande-do-sul",
        "mato-grosso-do-sul",
        "mato-grosso",
        "goias",
        "distrito-federal"
    ];

    const search_query = params.search_slug;
    query = search_query.replace(/-/g, " ").split(" em ")[0];
    if( search_query.split("-").slice(-1)[0] === "brasil" ){
        state = search_query
            .replace(/-/g," ")
            .replace("brasil", "")
            .split(" em ")
        .slice(-1)[0];
    } else {
        const regionSearch = search_query
            .split("-em-")
            .slice(-1)[0];

        for( let stateOpt of states ){
            if ( regionSearch.includes(stateOpt) ){
                state = stateOpt.replace(/-/g, " ");
                city = regionSearch
                    .replace(`-${stateOpt}`, "")
                    .replace(/-/g, " ");
            }
        }
    }

    jobs = await fetch(`https://site-vagas.herokuapp.com/jobs/search`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Bearer': process.env.API_BEARER_TOKEN
        },
        body: JSON.stringify({
            city: city || "",
            state: state || "",
            query: query || ""
        })
    });
    // jobs = await fetch('https://site-vagas.herokuapp.com/jobs/get/', {headers:{'Bearer': process.env.API_BEARER_TOKEN}})
    jobs = await jobs.json();

    return {
        props: {
            jobs
        }
    }
}

export default Jobs