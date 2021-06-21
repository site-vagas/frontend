import { useState } from "react";
import Image from 'next/image';
import JobHorizontal from "./JobHorizontal";
import styles from './JobsManager.module.scss';
import JobsFilter from "./JobsFilter";
import alasql from 'alasql';

export default function JobsManager(props){

    // Constructor
        // Tables
            var tables = {
                // Master
                job : [],
                state : [],
                city : [],
                organization : [],
                category : [],
                subCategory : [],
                role : [],
                benefit : [],
                type : [],
                // Relations
                rel_job_and_organization : [],
                rel_job_and_category : [],
                rel_job_and_subCategory : [],
                rel_job_and_role : [],
                rel_job_and_benefit : [],
                rel_job_and_type : []
            }
            // Aux Variables to Check who was added to table
            var auxBuild_state = [];
            var auxBuild_city = [];
            var auxBuild_organization = [];
            var auxBuild_category = [];
            var auxBuild_subCategory = [];
            var auxBuild_role = [];
            var auxBuild_benefit = [];
            var auxBuild_type = [];
            // Keys to remove from Job Table to Normalize
            const keys_to_remove_from_jobs = [
                "__subCategories__",
                "__benefits__",
                "__types__",
                "__organization__",
                "__category__",
                "__role__"
            ]        
      
        // Build Tables
        for( let job of props.jobs ){
            // Build Tables
                // State
                if( !auxBuild_state.includes(job.state) ){
                    tables.state.push({ id: job.state, name: job.state });
                    auxBuild_state.push( job.state );
                };
                // Cities
                if( !auxBuild_city.includes(job.city) ){
                    tables.city.push({ id: job.city, name: job.city });
                    auxBuild_city.push( job.city );
                };
                // Organizations
                tables.rel_job_and_organization.push({ jobId: job.id, organizationId: job.__organization__.id });
                if( !auxBuild_organization.includes(job.__organization__.id) ) {
                    tables.organization.push( job.__organization__ );
                    auxBuild_organization.push( job.__organization__.id );
                };
                // Category
                tables.rel_job_and_category.push({ jobId: job.id, categoryId: job.__category__.id });
                if( !auxBuild_category.includes(job.__category__.id) ) {
                    tables.category.push( job.__category__ );
                    auxBuild_category.push( job.__category__.id );
                };
                // Role
                tables.rel_job_and_role.push({ jobId: job.id, roleId: job.__role__.id });
                if( !auxBuild_role.includes(job.__role__.id) ) {
                    tables.role.push( job.__role__ );
                    auxBuild_role.push( job.__role__.id );
                };
                // SubCategories
                for( let subCategory of job.__subCategories__ ){
                    tables.rel_job_and_subCategory.push({ jobId: job.id, subCategoryId: subCategory.id });
                    if( !auxBuild_subCategory.includes(subCategory.id) ){
                        tables.subCategory.push(subCategory);
                        auxBuild_subCategory.push(subCategory.id);
                    }
                }
                // Benefits
                for( let benefit of job.__benefits__ ){
                    tables.rel_job_and_benefit.push({ jobId: job.id, benefitId: benefit.id });
                    if( !auxBuild_benefit.includes(benefit.id) ){
                        tables.benefit.push(benefit);
                        auxBuild_benefit.push(benefit.id);
                    }
                }
                // Tipos
                for( let type of job.__types__ ){
                    tables.rel_job_and_type.push({ jobId: job.id, Id: type.id });
                    if( !auxBuild_type.includes(type.id) ){
                        tables.type.push(type);
                        auxBuild_type.push(type.id);
                    }
                }
            
            var tempJob = {};
            // Remove keys to normalize jobs Table
            for ( let key of Object.keys(job) ){
                if ( !keys_to_remove_from_jobs.includes(key) ){ tempJob[key] = job[key] };
            }
            tables.job.push(tempJob);
        }
            
        // Filters
        const [filters, setFilters] = useState({
            state: [],
            city: [],
            organization: [],
            category: [],
            subCategory: [],
            role: [],
            benefit: [],
            type: []
        });

    const handleFilterChange = (item, values) => {
        var tempFilters = {...filters};
        tempFilters[item] = values;
        console.log("Filter Change ", item, values)
        setFilters(tempFilters);
    }

    const handleFilterCleaning = () => {
        var tempFilters = {...filters};
        for(let key of Object.keys(tempFilters)){
            tempFilters[key] = [];
        }
        setFilters(tempFilters);
    }

    const search = () => {
        // Make the search of jobs applying the user filters
        function buildSearchFilter(item){
            const fromTo = {
                "state": "job.state",
                "city": "job.city"
            }
    
            if( !(filters[item].length === 0) ){
                let list = filters[item].map( (i) => {
                    return `'${i}'`
                });
                return `AND ${ Object.keys(fromTo).includes(item) ? fromTo[item] : `${ item }`.id } IN (${ list.toString() })`
            } else {
                return ""
            }
        }

        const query =`
            with jobs as(
                SELECT
                    job.id,
                    job.code,
                    job.title,
                    role.name as role,
                    job.slug,
                    job.city,
                    job.state,
                    organization.name as organizationName,
                    organization.logoUrl

                FROM ? as rel_job_and_organization
                
                LEFT JOIN ? as job
                    ON rel_job_and_organization.jobId = job.id

                LEFT JOIN ? as organization
                    ON rel_job_and_organization.organizationId = organization.id

                LEFT JOIN ? as rel_job_and_category
                    ON rel_job_and_category.jobId = job.id
                LEFT JOIN ? as category
                    ON rel_job_and_category.categoryId = category.id

                LEFT JOIN ? as rel_job_and_role
                    ON rel_job_and_role.jobId = job.id
                LEFT JOIN ? as role
                    ON rel_job_and_role.roleId = role.id

                LEFT JOIN ? as rel_job_and_type
                    ON rel_job_and_type.jobId = job.id
                LEFT JOIN ? as type
                    ON rel_job_and_type.typeId = type.id

                LEFT JOIN ? as rel_job_and_benefit
                    ON rel_job_and_benefit.jobId = job.id
                LEFT JOIN ? as benefit
                    ON rel_job_and_benefit.benefitId = benefit.id
                WHERE
                        job.id NOT NULL
                    ${ buildSearchFilter('state') }
                    ${ buildSearchFilter('city') }

            )

            SELECT
                id,
                code,
                title,
                role,
                slug,
                city,
                state,
                organizationName,
                logoUrl
            FROM jobs
            GROUP BY
                id,
                code,
                title,
                role,
                slug,
                city,
                state,
                organizationName,
                logoUrl
        `;

        const data = alasql(
            query,
            [ 
            tables.rel_job_and_organization ,
            tables.job,
            tables.organization,
            tables.rel_job_and_category,
            tables.category,
            tables.rel_job_and_role,
            tables.role,
            tables.rel_job_and_type,
            tables.type,
            tables.rel_job_and_benefit,
            tables.benefit
        ]);
        return data
    }

    const getListOfJobs = () => {
        // Build the List of Jobs that gonna be presented at display
        const searchResults = search();

        const jobs = searchResults.map( (job, key) => {
            return <JobHorizontal
                job={ job }
                className={ styles.JobHorizontal }
                key={ key }
            />
        });

        return(
            <div className={ styles.ListOfJobs }>
                <p>{`${ searchResults.length } Vagas Encontradas`}</p>
                
                { jobs }
            </div>
        )
    }

    const getFilter = () => {
    
        return (
            <JobsFilter
                className={`${ styles.JobsFilter } ${ showFilterButton ? styles.ShowFilter : "" }`}
                handleClose={ handleFilterShowState }
                changesHandler={ handleFilterChange }
                clearFilter={ handleFilterCleaning }
                state={{ itens: tables.state, selected: filters.state }}
                city={{ itens: tables.city, selected: filters.city }}
                organization={{ itens: tables.organization, selected: filters.organization }}
                category={{ itens: tables.category, selected: filters.category }}
                subCategory={{ itens: tables.subCategory, selected: filters.subCategory }}
                role={{ itens: tables.role, selected: filters.role }}
                benefit={{ itens: tables.benefit, selected: filters.benefit }}
                type={{ itens: tables.type, selected: filters.type }}
            />
        )
    }

    const [ showFilterButton, setShowFilterButton ] = useState(false);
    const handleFilterShowState = () => {
        setShowFilterButton( !showFilterButton );
    }
    return (
        <div className={ styles.JobsManager }>
            <div className={ styles.Menu }>
                <div className={ styles.jobsFilterButton } onClick={ handleFilterShowState }>
                    <Image
                        src="/imgs/filter.png"
                        alt="Filtrar Vagas"
                        width="35"
                        height="35"
                    />
                    <span>Filtar</span>
                </div>

                <div  className={ styles.queryFilterButton }>
                    <span>Pesquisar</span>
                    <Image
                        src="/imgs/search.png"
                        alt="Pesquisar"
                        width="35"
                        height="35"
                    />
                </div>
            </div>
            <div className={ styles.ContentBox }>
                { getFilter() } 

                { getListOfJobs() }
            </div>
        </div>
    )
}