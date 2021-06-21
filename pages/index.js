import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import JobForm from './../components/pages/home/JobForm';

function Home({ allRegions }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tickun - Encontre as melhores Vagas</title>
        <meta name="description" content="Encontre as melhores Vagas no Mercado. A sua nova oportunidade está aqui." />
      </Head>

      <main className={styles.main}>
        <JobForm allRegions={ allRegions }/>
      </main>
    </div>
  )
}

export async function getStaticProps( context ){
  var allRegions = [];
  var states = [];

  var regions = await fetch( "https://site-vagas.herokuapp.com/jobs/regions" );
  regions = await regions.json();

  regions.map( ( regionOpt ) => {
      allRegions.push({
          city: regionOpt.jobs_city,
          state: regionOpt.jobs_state,
          country: "Brasil"
      });

      if ( !states.includes( regionOpt.jobs_state ) ){
          allRegions.push({
              city: "",
              state: regionOpt.jobs_state,
              country: "Brasil"
          })
      };
  });

  return {
    props: { allRegions }
  }
}

export default Home