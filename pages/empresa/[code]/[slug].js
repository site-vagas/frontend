import { useRouter } from 'next/router';
import { Organizations } from './../../../api';
import styles from './../../../styles/OrganizationPage.module.scss';
import JobsManager from './../../../components/jobs/JobsManager';
import PageHeader from '../../../components/general/PageHeader';
export default function Organization({ organization }){
    const router = useRouter();

    if ( router.isFallback ) { return <>Carregando...</> }
    return(
        <>
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
    return { props: { organization } }
}