import Link from 'next/link';
import styles from './RelatedJobs.module.scss';
import { JobsTools, state_abbrev } from './../../../tools';

export default function RelatedJob(props){
    const getRelatedJobs = () => {
        function RelatedJob(props){
            const isRemoteJob = () => {
                const REMOTE_JOB_TYPE_ID = "278d7a24-e358-4979-aba8-3a0d50190b05"

                const job_types = props.job.__types__.map((type) => {
                    return type.id
                });
                
                return job_types.includes(REMOTE_JOB_TYPE_ID)
            }

            const get_role_and_remote = () => {
                if(isRemoteJob()){
                    return `${props.job.__role__.name} - Vaga Remota`;
                } else {
                    return props.job.__role__.name
                }
            }

            const get_short_name = () => {
                if(props.job.title.length > 45){
                    return `${props.job.title.substring(0, 45)}...`
                } else {
                    return props.job.title
                }
            }

            return(
                <div className={ styles.RelatedJob }>
                    <div>
                        <Link href={`/vaga/${ props.job.code }/${ props.job.slug }`}>
                            <a>{ get_short_name() }</a>
                        </Link>
                    </div>

                    <div>
                        <p>{ get_role_and_remote() }</p>
                    </div>

                    <div>
                        <div>
                            <img src={props.job.__organization__.logoUrl}></img>
                        </div>
                        <div>
                            <p>{ props.job.__organization__.name }</p>
                        </div>
                    </div>

                    <div>
                        <p>
                            <p>
                                { `${ props.job.city }-${ state_abbrev(props.job.state) }` }
                            </p>
                            <p 
                                element="howlong"
                                howlong={JobsTools.getHowLong(new Date(props.job.createdAt))["text"]}
                            >
                                { JobsTools.getHowLong(new Date(props.job.createdAt))["text"] }
                            </p>
                        </p>
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