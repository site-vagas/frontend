import { useRouter } from 'next/router';
import { Organizations } from './../../../api';
import styles from './../../../styles/OrganizationPage.module.scss';
import JobsManager from './../../../components/jobs/JobsManager';
import PageHeader from '../../../components/general/PageHeader';
import Head from 'next/head';

export default function Organization({ organization }){
    const router = useRouter();

    if ( router.isFallback ) { return <>Carregando...</> }
    return(
        <>
        <Head>
            <title>{ `Tickun - ${organization.name}` }</title>
            <description>{ `Acompanhe as vagas da ${ organization.name } e encontre grandes oportunidades para você no mercado de trabalho.` }</description>
            <script data-ad-client="ca-pub-6542168921640292" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        </Head>
        <PageHeader />
        <div className={ styles.Organization }>
            <div className={ styles.Header }>
                <div>
                    <div>
                        <img src={organization.logoUrl}  alt={`Logo ${organization.name}`}/>
                    </div>

                    <div>
                        <p>{ organization.name }</p>
                    </div>
                </div>
                <div>
                    <div dangerouslySetInnerHTML={{ __html: organization.description }} />
                </div>
            </div>
            <div>
            <div>
                <h2>Nossas Vagas</h2>
            </div>
            <JobsManager
                jobs={ organization.__jobs__ }
                filters={[
                    'state','city','benefit',
                    'type','role','category',
                    'subCategory'
                ]}
                replacers={{
                    "logoUrl": organization.logoUrl,
                    "organizationName": organization.name

                }}
                dontMakeNewSearch={ true }
                />
            </div>
        </div>
        </>
    )
}

export async function getStaticPaths(){
    const organizations = await Organizations.getSlugs();
    const paths = organizations.map( (organization) =>({
        params:{ code: organization.code, slug: organization.slug }
    }));
    return { paths, fallback: true }
}

export async function getStaticProps({ params }){
    const organization = await Organizations.getJobs(params.code, params.slug);
    return {
        props: {
            organization
        },
        revalidate: 86400
    }
}