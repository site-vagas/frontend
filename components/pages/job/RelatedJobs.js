import Link from 'next/link';
import styles from './RelatedJobs.module.scss'; 

export default function RelatedJob(props){
    const getRelatedJobs = () => {
        function RelatedJob(props){
            return(
                <div className={ styles.RelatedJob }>
                    <Link href={`/vaga/${ props.job.code }/${ props.job.slug }`}>
                        <a>{ props.job.title }</a>
                    </Link>

                    <div>
                        <div>

                        </div>
                        <div>
                            <p>{ props.job.__role__.name }</p>
                            <p>{ props.job.__organization__.name }</p>
                            <p>{ `${ props.job.city } - ${ props.job.state }` }</p>
                        </div>
                    </div>
                </div>
            )
        }
        
        return props.jobs.map( ( job, key ) =>{
            return <RelatedJob key={ key } job={ job } />
        })
    }
    
    return(
        <div className={ styles.RelatedJobs }>
            { getRelatedJobs() }
        </div>
    )
}