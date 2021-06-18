import Link from 'next/link';
import Jobs from '../../pages/vagas/[search_slug]';
export default function JobHorizontal(props){
    return(
        <div className={ props.className }>
            <div>
                <div>
                    <img src={ props.job.logoUrl }/>
                </div>

                <div>
                    <Link href={`/vaga/${ props.job.code }/${ props.job.slug }`}>
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