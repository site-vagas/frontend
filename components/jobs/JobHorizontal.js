import Link from 'next/link';
import Jobs from '../../pages/vagas/[search_slug]';
import { useRouter } from 'next/router';

export default function JobHorizontal(props){

    const getJobUrl = () => {
        return `/vaga/${ props.job.code }/${ props.job.slug }`
    }

    return(
        <div className={ props.className }>
            <div>
                <div>
                    <img src={ props.job.logoUrl } alt={ props.job.organizationName }/>
                </div>

                <div>
                    <Link href={ getJobUrl() }>
                        <a>{ props.job.title }</a>
                    </Link>
                    <p>{ props.job.role }</p>
                    <p>{ props.job.organizationName }</p>
                    <p>{`${ props.job.city } - ${ props.job.state }`}</p>
                </div>
            </div>
            <p>Há 2 semanas</p>
        </div>
    )
}