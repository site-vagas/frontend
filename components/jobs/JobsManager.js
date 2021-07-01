import { useEffect, useState } from "react";
import Image from 'next/image';
import JobHorizontal from "./JobHorizontal";
import styles from './JobsManager.module.scss';
import alasql from 'alasql';
import Link from 'next/link';
import JobsFilter from './JobsFilter';

export default function JobsManager(props){

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
    const [tables, setTables] = useState({});
    const [ showFilterButton, setShowFilterButton ] = useState(false);

    const build = () => {
    
        // Tables
        var aux_tables = {
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
                if( props.filters.includes('state') && !auxBuild_state.includes(job.state) ){
                    aux_tables.state.push({ id: job.state, name: job.state });
                    auxBuild_state.push( job.state );
                };
                // Cities
                if( props.filters.includes('city') && !auxBuild_city.includes(job.city) ){
                    aux_tables.city.push({ id: job.city, name: job.city });
                    auxBuild_city.push( job.city );
                };
                // Organizations
                if(props.filters.includes('organization')){
                    aux_tables.rel_job_and_organization.push({ jobId: job.id, organizationId: job.__organization__.id });
                    if( !auxBuild_organization.includes(job.__organization__.id) ) {
                        aux_tables.organization.push( job.__organization__ );
                        auxBuild_organization.push( job.__organization__.id );
                    };
                }
                // Category
                if(props.filters.includes('category')){
                    aux_tables.rel_job_and_category.push({ jobId: job.id, categoryId: job.__category__.id });
                    if( !auxBuild_category.includes(job.__category__.id) ) {
                        aux_tables.category.push( job.__category__ );
                        auxBuild_category.push( job.__category__.id );
                    };
                }
                // Role
                if(props.filters.includes('role')){
                    aux_tables.rel_job_and_role.push({ jobId: job.id, roleId: job.__role__.id });
                    if( !auxBuild_role.includes(job.__role__.id) ) {
                        aux_tables.role.push( job.__role__ );
                        auxBuild_role.push( job.__role__.id );
                    };
                }
                // SubCategories
                if(props.filters.includes('subCategory')){
                    for( let subCategory of job.__subCategories__ ){
                        aux_tables.rel_job_and_subCategory.push({ jobId: job.id, subCategoryId: subCategory.id });
                        if( !auxBuild_subCategory.includes(subCategory.id) ){
                            aux_tables.subCategory.push(subCategory);
                            auxBuild_subCategory.push(subCategory.id);
                        }
                    }
                }
                // Benefits
                if(props.filters.includes('benefit')){
                    for( let benefit of job.__benefits__ ){
                        aux_tables.rel_job_and_benefit.push({ jobId: job.id, benefitId: benefit.id });
                        if( !auxBuild_benefit.includes(benefit.id) ){
                            aux_tables.benefit.push(benefit);
                            auxBuild_benefit.push(benefit.id);
                        }
                    }
                }
                // Tipos
                if(props.filters.includes('type')){
                    for( let type of job.__types__ ){
                        aux_tables.rel_job_and_type.push({ jobId: job.id, Id: type.id });
                        if( !auxBuild_type.includes(type.id) ){
                            aux_tables.type.push(type);
                            auxBuild_type.push(type.id);
                        }
                    }
                }
            
            var tempJob = {};
            // Remove keys to normalize jobs Table
            for ( let key of Object.keys(job) ){
                if ( !keys_to_remove_from_jobs.includes(key) ){ tempJob[key] = job[key] };
            }
            aux_tables.job.push(tempJob);
        }

        return aux_tables
    }    
    
    const handleFilterChange = (item, itens) => {
        var tempFilters = {...filters};
        tempFilters[item] = itens;
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
            };
            
            if( props.filters.includes(item) && !(filters[item].length === 0 ) ){
                let list = filters[item].map( (i) => {
                    return `'${i['id']}'`
                });
                const filterCondition = `AND ${ Object.keys(fromTo).includes(item) ? fromTo[item] : `${ item }.id` } IN (${ list.toString() })`;
                return filterCondition

            } else {
                return ""
            }
        }

        function getQuery(){
            if( props.filters.includes('organization') ){
                const query = `
                    with jobs as(
                        SELECT
                            job.id,
                            job.code,
                            job.title,
                            role.name as role,
                            job.slug,
                            job.city,
                            job.state,
                            job.createdAt,
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
        
                        LEFT JOIN ? as rel_job_and_subCategory
                            ON rel_job_and_subCategory.jobId = job.id
                        LEFT JOIN ? as subCategory
                            ON rel_job_and_subCategory.subCategoryId = subCategory.id

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
                                1 = 1
                            ${ buildSearchFilter('organization') }
                            ${ buildSearchFilter('category') }
                            ${ buildSearchFilter('subCategory') }
                            ${ buildSearchFilter('role') }
                            ${ buildSearchFilter('type') }
                            ${ buildSearchFilter('benefit') }
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
                        createdAt,
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
                        createdAt,
                        organizationName,
                        logoUrl
                    ORDER BY createdAt desc
                `;
                const data = [
                    tables.rel_job_and_organization ,
                    tables.job,
                    tables.organization,
                    tables.rel_job_and_category,
                    tables.category,
                    tables.rel_job_and_subCategory,
                    tables.subCategory,
                    tables.rel_job_and_role,
                    tables.role,
                    tables.rel_job_and_type,
                    tables.type,
                    tables.rel_job_and_benefit,
                    tables.benefit
                ];

                return[query, data]
            } else {
                const query = `
                    with jobs as(
                        SELECT
                            job.id,
                            job.code,
                            job.title,
                            role.name as role,
                            job.slug,
                            job.city,
                            job.state,
                            job.createdAt

                        FROM ? as job
        
                        LEFT JOIN ? as rel_job_and_category
                            ON rel_job_and_category.jobId = job.id
                        LEFT JOIN ? as category
                            ON rel_job_and_category.categoryId = category.id

                        LEFT JOIN ? as rel_job_and_subCategory
                            ON rel_job_and_subCategory.jobId = job.id
                        LEFT JOIN ? as subCategory
                            ON rel_job_and_subCategory.subCategoryId = subCategory.id
        
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
                                1 = 1
                            ${ buildSearchFilter('state') }
                            ${ buildSearchFilter('city') }
                            ${ buildSearchFilter('benefit') }
                            ${ buildSearchFilter('category') }
                            ${ buildSearchFilter('subCategory') }
                            ${ buildSearchFilter('subCategory') }
                            ${ buildSearchFilter('role') }
                            ${ buildSearchFilter('type') }
                    )
        
                    SELECT
                        id,
                        code,
                        title,
                        role,
                        slug,
                        city,
                        state,
                        createdAt
                    FROM jobs
                    GROUP BY
                        id,
                        code,
                        title,
                        role,
                        slug,
                        city,
                        state,
                        createdAt
                    ORDER BY createdAt desc
                `;
                const data = [
                    tables.job,
                    tables.rel_job_and_category,
                    tables.category,
                    tables.rel_job_and_subCategory,
                    tables.subCategory,
                    tables.rel_job_and_role,
                    tables.role,
                    tables.rel_job_and_type,
                    tables.type,
                    tables.rel_job_and_benefit,
                    tables.benefit
                ];
                return [query, data]
            }
        }

        var searchData = getQuery();
        var query = searchData[0].replace('\n','');
        var usedTables = searchData[1];
        if (Object.keys(tables).length === 0){
            return []
        } else {
            return alasql(query, usedTables)
        }
    }

    const getListOfJobs = () => {
        // Build the List of Jobs that gonna be presented at display
        if( props.jobs.length === 0 ){
            return(
                <div className={ styles.JobsNotFound }>
                    <p>Nenhuma vaga foi encontrada.</p>
                    <Link href='/'>
                        <a>Fazer Nova Pesquisa</a>
                    </Link>
                </div>
            )
        }
        
        const searchResults = search();
        if ( searchResults.length === 0 ){
            return(
                <div className={ styles.noFilterMatches }>
                    <p>Nenhuma vaga encontrada para a combinação de filtros utilizada. Tente outra combinação.</p>
                </div>
            )
        } else {
            var jobs = [];
            var jobKey = 0;
            const replacers = {
                "logoUrl":  props.replacers["logoUrl"] ? props.replacers["logoUrl"] : undefined,
                "organizationName":  props.replacers["organizationName"] ? props.replacers["organizationName"] : undefined
            };

            for(let job of searchResults){                
                jobs.push(
                    <JobHorizontal
                        job={ job }
                        className={ styles.JobHorizontal }
                        key={ jobKey }
                        replacers={ replacers }
                    />
                );

                jobKey = jobKey + 1;
            }

            return(
                <div className={ styles.ListOfJobs }>
                    <p>{`${ searchResults.length } Vagas Encontradas`}</p>
                    { jobs }
                </div>
            )
        }
    }
    
    const getFilter = () => {
        if(!(Object.keys(tables).length === 0)) {
            var filterData = {};
            for(let item of props.filters){
                filterData[item] = {itens: tables[item], selected: filters[item] }
            }

            return (
                <JobsFilter
                    className={`${ styles.JobsFilter } ${ showFilterButton ? styles.ShowFilter : "" }`}
                    filters={ props.filters }
                    handleClose={ handleFilterShowState }
                    changesHandler={ handleFilterChange }
                    clearFilter={ handleFilterCleaning }
                    data={ filterData }
                />
            )
        } else {
            return <></>
        }
    }

    const handleFilterShowState = () => {
        setShowFilterButton( !showFilterButton );
    }

    useEffect(() => {
        const tables = build();
        setTables(tables)
    }, [])

    search()

    // return (<></>)
    return (
        <div className={ styles.JobsManager }>
            <div className={ styles.Menu }>
                <div className={ styles.jobsFilterButton } onClick={ handleFilterShowState }>
                    <Image
                        src="/imgs/filter.png"
                        alt="Filtrar Vagas"
                        width="25"
                        height="25"
                    />
                    <span>Filtar Vagas</span>
                </div>
            </div>
            <div className={ styles.ContentBox }>
                { getFilter() } 

                { getListOfJobs()  }
            </div>
        </div>
    )
}