import { useRouter } from 'next/router';
import Link from 'next/link';
import JobsManager from '../../components/jobs/JobsManager';
import styles from './../../styles/SearchResults.module.scss';

function Jobs({ jobs }) {

    const router = useRouter();

    if ( router.isFallback ) { return <>Carregando...</> }
    return (
        <div className={ styles.SearchResults }>
            <div className={ styles.header }>
                <Link href="/">
                    <a><p>Tickun <span>Encontre a sua vaga</span></p></a>
                </Link>
            </div>

            <JobsManager jobs={ jobs } />
        </div>
    )
}

export async function getStaticPaths(){
    const paths = [{params: { search_slug: "vagas" }}];
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

    jobs = await fetch(`https://site-vagas.herokuapp.com/jobs/get/`);
    jobs = await jobs.json();

    console.log('query: ', query, city, state)
    return {
        props: {
            jobs
        }
    }
}

export default Jobs