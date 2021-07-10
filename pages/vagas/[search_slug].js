import { useRouter } from 'next/router';
import Head from 'next/head';
import JobsManager from '../../components/jobs/JobsManager';
import PageHeader from '../../components/general/PageHeader';
import styles from './../../styles/SearchResults.module.scss';
import { string_to_slug } from '../../tools';

function Jobs({ jobs }) {

    const router = useRouter();
    
    const getSearchTitle = () => {
        var search = router.query['search_slug'];
        console.log(search)
        search = search.replace(/-/g, ' ').replace(/(^\w{1}|(?<=\s)\w{1})/g, (l) => { return l.toUpperCase() });
        return `Vagas de emprego para ${search}`
    }
     
    if ( router.isFallback ) { return <>Carregando...</> }
    return (
        <div className={ styles.SearchResults }>
            <Head>
                <title>Tickun - { getSearchTitle() }</title>
            </Head>
            <PageHeader/>

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
    const search_query = string_to_slug(params.search_slug);

    var jobs = await fetch(`https://site-vagas.herokuapp.com/jobs/search`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Bearer': process.env.API_BEARER_TOKEN
        },
        body: JSON.stringify({
            query: search_query
        })
    });
    jobs = await jobs.json();

    return {
        props: {
            jobs
        }
    }
}

export default Jobs