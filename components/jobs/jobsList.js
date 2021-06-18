import { useState } from "react";
import Image from 'next/image';
import JobHorizontal from "./JobHorizontal";
import styles from './JobsList.module.scss';
import JobsFilter from "./JobsFilter";
import alasql from 'alasql';
import BuildManifestPlugin from "next/dist/build/webpack/plugins/build-manifest-plugin";

export default function JobsList(props){

    // Constructor
        // Tables
            var tables = {
                // Master
                jobs : [],
                cities : [],
                organizations : [],
                categories : [],
                subCategories : [],
                roles : [],
                benefits : [],
                types : [],
                // Relations
                rel_jobs_and_organizations : [],
                rel_jobs_and_categories : [],
                rel_jobs_and_subCategories : [],
                rel_jobs_and_roles : [],
                rel_jobs_and_benefits : [],
                rel_jobs_and_types : []
            }
            // Aux Variables to Check who was added to table
            var auxBuild_cities = [];
            var auxBuild_organizations = [];
            var auxBuild_categories = [];
            var auxBuild_subCategories = [];
            var auxBuild_roles = [];
            var auxBuild_benefits = [];
            var auxBuild_types = [];
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
                    // Cities
                    if( !auxBuild_cities.includes(job.city) ){
                        tables.cities.push({ id: job.city, name: job.city });
                        auxBuild_cities.push( job.city );
                    };
                    // Organizations
                    tables.rel_jobs_and_organizations.push({ jobId: job.id, organizationId: job.__organization__.id });
                    if( !auxBuild_organizations.includes(job.__organization__.id) ) {
                        tables.organizations.push( job.__organization__ );
                        auxBuild_organizations.push( job.__organization__.id );
                    };
                    // Category
                    tables.rel_jobs_and_categories.push({ jobId: job.id, categoryId: job.__category__.id });
                    if( !auxBuild_categories.includes(job.__category__.id) ) {
                        tables.categories.push( job.__category__ );
                        auxBuild_categories.push( job.__category__.id );
                    };
                    // Role
                    tables.rel_jobs_and_roles.push({ jobId: job.id, roleId: job.__role__.id });
                    if( !auxBuild_roles.includes(job.__role__.id) ) {
                        tables.roles.push( job.__role__ );
                        auxBuild_roles.push( job.__role__.id );
                    };
                    // SubCategories
                    for( let subCategory of job.__subCategories__ ){
                        tables.rel_jobs_and_subCategories.push({ jobId: job.id, subCategoryId: subCategory.id });
                        if( !auxBuild_subCategories.includes(subCategory.id) ){
                            tables.subCategories.push(subCategory);
                            auxBuild_subCategories.push(subCategory.id);
                        }
                    }
                    // Benefits
                    for( let benefit of job.__benefits__ ){
                        tables.rel_jobs_and_benefits.push({ jobId: job.id, benefitId: benefit.id });
                        if( !auxBuild_benefits.includes(benefit.id) ){
                            tables.benefits.push(benefit);
                            auxBuild_benefits.push(benefit.id);
                        }
                    }
                    // Tipos
                    for( let type of job.__types__ ){
                        tables.rel_jobs_and_types.push({ jobId: job.id, Id: type.id });
                        if( !auxBuild_types.includes(type.id) ){
                            tables.types.push(type);
                            auxBuild_types.push(type.id);
                        }
                    }
                
                var tempJob = {};
                // Remove keys to normalize jobs Table
                for ( let key of Object.keys(job) ){
                    if ( !keys_to_remove_from_jobs.includes(key) ){ tempJob[key] = job[key] };
                }
                tables.jobs.push(tempJob);
            }

            // Set inital filter considering all values
            const getIds = (itens) => {
                return itens.map( (item) => {
                    return item.id
                })
            }

    const [filters, setFilters] = useState(            {
        cities: getIds(tables.cities),
        organizations: getIds(tables.organizations),
        categories: getIds(tables.categories),
        subCategories: getIds(tables.subCategories),
        roles: getIds(tables.roles),
        benefits: getIds(tables.benefits),
        types: getIds(tables.types)
    });

    const handleFilterChange = (item, values) => {
        var tempFilters = {...filters};
        tempFilters[item] = values;
        setFilters(tempFilters);
    }

    const buildFilterTable = (item) => {
        const table = filters[item].map( (i) => {
            return {id: i}
        });
        return table
    }

    const search = () => {
        const data = alasql(`
            with jobs as (
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

                FROM ? as rel_jobs_and_organizations
                
                LEFT JOIN ? as job
                    ON rel_jobs_and_organizations.jobId = job.id

                LEFT JOIN ? as organization
                    ON rel_jobs_and_organizations.organizationId = organization.id

                LEFT JOIN ? as rel_jobs_and_categories
                    ON rel_jobs_and_categories.jobId = job.id
                LEFT JOIN ? as category
                    ON rel_jobs_and_categories.categoryId = category.id

                LEFT JOIN ? as rel_jobs_and_roles
                    ON rel_jobs_and_roles.jobId = job.id
                LEFT JOIN ? as role
                    ON rel_jobs_and_roles.roleId = role.id

                LEFT JOIN ? as rel_jobs_and_types
                    ON rel_jobs_and_types.jobId = job.id
                LEFT JOIN ? as type
                    ON rel_jobs_and_types.typeId = type.id

                LEFT JOIN ? as rel_jobs_and_benefits
                    ON rel_jobs_and_benefits.jobId = job.id
                LEFT JOIN ? as benefit
                    ON rel_jobs_and_benefits.benefitId = benefit.id
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

        `, [ 
            tables.rel_jobs_and_organizations ,
            tables.jobs,
            tables.organizations,
            tables.rel_jobs_and_categories,
            tables.categories,
            tables.rel_jobs_and_roles,
            tables.roles,
            tables.rel_jobs_and_types,
            tables.types,
            tables.rel_jobs_and_benefits,
            tables.benefits

        ]);
        return data
    }

    const getJobsList = () => {
        return search().map( (job, key) => {
            return <JobHorizontal
                job={ job }
                className={ styles.JobHorizontal }
                key={ key }
            />
        })
    }

    return (
        <div className={ styles.JobsInList }>
            <div className={ styles.Menu }>
                <div className={ styles.jobsFilter }>
                    <Image
                        src="/imgs/filter.png"
                        alt="Filtro"
                        width="35"
                        height="35"
                    />
                    <span>Filtar</span>
                </div>

                <div  className={ styles.queryFilter }>
                    <span>Pesquisar</span>
                    <Image
                        src="/imgs/search.png"
                        alt="Filtro"
                        width="35"
                        height="35"
                    />
                </div>
            </div>
            <div className={ styles.ContentBox }>
                <JobsFilter
                    changesHandler={handleFilterChange}
                    cities={{ itens: tables.cities, selected: filters.cities }}
                    organizations={{ itens: tables.organizations, selected: filters.organizations }}
                    categories={{ itens: tables.categories, selected: filters.categories }}
                    subCategories={{ itens: tables.subCategories, selected: filters.subCategories }}
                    roles={{ itens: tables.roles, selected: filters.roles }}
                    benefits={{ itens: tables.benefits, selected: filters.benefits }}
                    types={{ itens: tables.types, selected: filters.types }} 
                />

                <div className={ styles.ListOfJobs }>
                    { getJobsList() }
                </div>
            </div>
        </div>
    )
}