import { useRouter } from 'next/router';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import styles from './../../../styles/JobPage.module.scss';
import RelatedJob from '../../../components/pages/job/RelatedJobs';

function Job({ job, relatedJobs }){
    const router = useRouter();
    const [footerApplyButton_display, setfooterApplyButton_display] = useState(false);
    const [applyWindow_display, setapplyWindow_display] = useState(false);
    const ApplyButtonRef = useRef(null);

    useEffect( function setHandlePageScroll(){
        
        function handlePageScroll() {
            var scrollY = window.scrollY;
            var applyButtonPosition = ApplyButtonRef.current.offsetTop;
            var applyButtonHeight = ApplyButtonRef.current.offsetHeight;
            if( scrollY > (applyButtonPosition + applyButtonHeight) ) {
                setfooterApplyButton_display(true);
            } else {
                setfooterApplyButton_display(false);
            }
        }

        window.addEventListener("scroll", handlePageScroll);
    
        return function removeHandlePageScroll(){
            window.removeEventListener("scroll", handlePageScroll);
        }
    })

    const handleApplyButtonClick = () => {
        setapplyWindow_display(true);
    }

    const handleCloseButton_applyWindow = () => {
        setapplyWindow_display(false);
    }

    if ( router.isFallback ) { return <>Carregando...</> }
    return(
        <div className={styles.JobPage}>
            <div className={`${ applyWindow_display ? styles.bluredContent : "" }`}>
                <div className={styles.closeButton}>
                    <p>X</p>
                </div>

                {/* Header */}
                <div>
                    <div className={styles.jobTitle}>
                        <h1>{ job.title }</h1>
                    </div>

                    <div className={styles.jobPlace}>
                        <div>
                            <img
                                src={job.__organization__.logoUrl}
                                alt={job.__organization__.name}
                                width="80px"
                                height="80px"
                            />
                        </div>

                        <div>
                            <div>
                                <p>{job.__role__.name}</p>
                                <p>{job.__organization__.name}</p>
                                <p>
                                    <span>{job.city}</span>
                                    <span>{job.state}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.time}>
                        <p>Há 2 semanas</p>
                    </div>

                    <div>
                        <button
                            className={styles.applyButton}
                            ref={ApplyButtonRef}
                            onClick={ handleApplyButtonClick }
                        >Candidatar-se</button>
                    </div>
                </div>

                <hr></hr>

                <div className={styles.jobBody}>
                    <div>
                        <h2>Descrição da Vaga</h2>
                        <div dangerouslySetInnerHTML={{__html: job.description}}/>
                    </div>

                    <div>
                        <h2>Principais Atividade</h2>
                        <div dangerouslySetInnerHTML={{__html: job.mainActivities}}/>
                    </div>

                    <div>
                        <h2>Requisitos Obrigatórios</h2>
                        <div dangerouslySetInnerHTML={{__html: job.mandatoryReqs}}/>
                    </div>

                    <div>
                        <h2>Diferenciais</h2>
                        <div dangerouslySetInnerHTML={{__html: job.differentials}}/>
                    </div>
                </div>

                <div>
                    <div className={styles.Benefits}>
                    </div>
                </div>

                <div>
                    <h2>Vagas Semelhantes</h2>
                    <RelatedJob jobs={ relatedJobs }/>
                </div>

                <div className={`${styles.footerApplyButton} ${
                    footerApplyButton_display ? styles.footerApplyButtonShow : ""}`}
                >
                    <button
                        className={styles.applyButton}
                        onClick={ handleApplyButtonClick }
                    >Candidatar-se</button>
                </div>
            </div>

            <div className={`${ styles.applyWindow } ${
                applyWindow_display ? styles.applyWindowShow : ""}`}
            >
                <div  className={styles.closeButton}>
                    <p onClick={ handleCloseButton_applyWindow }>X</p>
                </div>

                <div className={ styles.applyWindow_body }>
                    <div className={ styles.applyWindow_options }>
                        <div>
                            <p>Canditar à Vaga</p>
                            <p>{ job.title }</p>
                            <p>{ job.__organization__.name }</p>
                        </div>

                        <div>
                            <p>Utilize um dos métodos abaixo para se canditar:</p>

                            <div className={`${job.applicationEmail ? "" : styles.applyWindow_optionsEmail}`}>
                                <p>Envie o seu currículo para o email abaixo:</p>
                                <p>{ job.applicationEmail ? job.applicationEmail : "" }</p>
                            </div>
                            
                            <p className={`${job.applicationEmail ? "" : styles.applyWindow_optionsEmail}`}>Ou</p>

                            <div className={`${job.applicationLink ? "" : styles.applyWindow_optionsLink}`}>
                                <p>Utilize o link de candidatura abaixo:</p>
                                <a href={ job.applicationLink ? job.applicationLink : "" } target="_blank">
                                    Página de Candidatura
                                </a>
                            </div>
                        </div>

                        <div className={ styles.applyWindow_optionsFooter }>
                            <p>Se destaque no processo seletivo. Descubra <a href="#">Como se preparar para uma entrevista.</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getStaticPaths(){
    const resp = await fetch(`https://site-vagas.herokuapp.com/jobs/slugs`, { method: 'POST' });
    const jobs =  await resp.json();

    const paths = jobs.map( (job) => ({
        params: { code: job.code, slug: job.slug }
    }));

    return { paths, fallback: true }
}

export async function getStaticProps({ params }){
    const url = `https://site-vagas.herokuapp.com/jobs/by-code/${params.code}/${params.slug}`;
    var job = undefined;
    var relatedJobs = undefined;
    try {
        const resp = await fetch(url);
        job = await resp.json();
    } catch( err) {
        job = undefined;
    }

    if ( !job ){
        return {
            notFound: true
        }
    } else {

        relatedJobs = await fetch(`https://site-vagas.herokuapp.com/jobs/related/${job.id}/${job.__category__.id}`);
        relatedJobs = await relatedJobs.json();
    }

    return {
        props: { job, relatedJobs },
        revalidate: 86400
    }
}

export default Job