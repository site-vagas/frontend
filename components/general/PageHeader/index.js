import styles from './PageHeader.module.scss';
import Link from 'next/link';
import JobForm from '../../jobs/JobForm';
import Image from "next/image";
import { useState } from 'react';

export default function PageHeader( props ){

    const [jobFormDisplay, setJobFormDisplay] = useState(false);

    const handleJobFormDisplay = () => {
        setJobFormDisplay( !jobFormDisplay );
    }

    return(
        <div className={ styles.Header }>
            <Link href="/">
                <a><p>Tickun <span>Encontre a sua vaga</span></p></a>
            </Link>

            <div 
                className={ styles.queryFilterButton }
                onClick={ handleJobFormDisplay }
            >
                <span>Pesquisar</span>
                <Image
                    src="/imgs/search.png"
                    alt="Pesquisar"
                    width="25"
                    height="25"
                />
            </div>

            <div className  ={ jobFormDisplay ? styles.bluredContent_layer : "" } />

            <div className={ `${styles.FilterWindow}  ${jobFormDisplay ? styles.showFilter : styles.hideFilter}` }>
                <div className={styles.closeButton}>
                    <p onClick={ handleJobFormDisplay }>X</p>
                </div>

                <JobForm title="Encontre outras vagas:"/>
            </div>
        </div>        
    )
}