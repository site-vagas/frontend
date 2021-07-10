import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import JobForm from './../components/jobs/JobForm';

export default function Home() {
  return (
    <div className={styles.Home}>
      <Head>
        <title>Tickun - Encontre as melhores Vagas</title>
        <meta name="description" content="Encontre as melhores Vagas no Mercado. A sua nova oportunidade está aqui." />
      </Head>

      <div>
        <h1>Tickun</h1>
        <p>Encontre a vaga ideal para Você</p>
        <JobForm/>
      </div>
    </div>
  )
}