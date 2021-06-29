import Link from 'next/link';
import { JobsTools } from '../../tools';
export default function JobHorizontal(props){

    const getJobUrl = () => {
        return `/vaga/${ props.job.code }/${ props.job.slug }`
    }

    const howLong = JobsTools.getHowLong(new Date(props.job.createdAt));
    return(
        <div className={ props.className }>
            <div>
                <div>
                    <img
                        src={ props.replacers['logoUrl'] ? props.replacers['logoUrl'] : props.job.logoUrl }
                        alt={ props.replacers['organizationName'] ? props.replacers['organizationName'] : props.job.organizationName }
                    />
                </div>

                <div>
                    <Link href={ getJobUrl() }>
                        <a>{ props.job.title }</a>
                    </Link>
                    <p>{ props.job.role }</p>
                    <p>
                        { props.replacers['organizationName'] ? props.replacers['organizationName'] : props.job.organizationName }
                    </p>
                    <p>{`${ props.job.city } - ${ props.job.state }`}</p>
                </div>
            </div>
            <p element="howlong" howlong={howLong["text"]}>{ howLong["text"] }</p>
        </div>
    )
}