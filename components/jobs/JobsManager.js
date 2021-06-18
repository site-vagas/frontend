import alasql from 'alasql';

export default class JobsManager{
    constructor(jobs, filterChangesHandler){
        this.propagationFilterChanges = filterChangesHandler;

        // Tables
            // Master
            this.jobs = [];
            this.cities = [];
            this.organizations = [];
            this.categories = [];
            this.subCategories = [];
            this.roles = [];
            this.benefits = [];
            this.types = [];
            // Relations
            this.rel_jobs_and_organizations = [];
            this.rel_jobs_and_categories = [];
            this.rel_jobs_and_subCategories = [];
            this.rel_jobs_and_roles = [];
            this.rel_jobs_and_benefits = [];
            this.rel_jobs_and_types = [];

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
        for( let job of jobs ){
            // Build Tables
                // Cities
                if( !auxBuild_cities.includes(job.city) ){
                    this.cities.push({ id: job.city, name: job.city });
                    auxBuild_cities.push( job.city );
                };
                // Organizations
                this.rel_jobs_and_organizations.push({ jobId: job.id, organizationId: job.__organization__.id });
                if( !auxBuild_organizations.includes(job.__organization__.id) ) {
                    this.organizations.push( job.__organization__ );
                    auxBuild_organizations.push( job.__organization__.id );
                };
                // Category
                this.rel_jobs_and_categories.push({ jobId: job.id, categoryId: job.__category__.id });
                if( !auxBuild_categories.includes(job.__category__.id) ) {
                    this.categories.push( job.__category__ );
                    auxBuild_categories.push( job.__category__.id );
                };
                // Role
                this.rel_jobs_and_roles.push({ jobId: job.id, roleId: job.__role__.id });
                if( !auxBuild_roles.includes(job.__role__.id) ) {
                    this.roles.push( job.__role__ );
                    auxBuild_roles.push( job.__role__.id );
                };
                // SubCategories
                for( let subCategory of job.__subCategories__ ){
                    this.rel_jobs_and_subCategories.push({ jobId: job.id, subCategoryId: subCategory.id });
                    if( !auxBuild_subCategories.includes(subCategory.id) ){
                        this.subCategories.push(subCategory);
                        auxBuild_subCategories.push(subCategory.id);
                    }
                }
                // Benefits
                for( let benefit of job.__benefits__ ){
                    this.rel_jobs_and_benefits.push({ jobId: job.id, benefitId: benefit.id });
                    if( !auxBuild_benefits.includes(benefit.id) ){
                        this.benefits.push(benefit);
                        auxBuild_benefits.push(benefit.id);
                    }
                }
                // Tipos
                for( let type of job.__types__ ){
                    this.rel_jobs_and_types.push({ jobId: job.id, Id: type.id });
                    if( !auxBuild_types.includes(type.id) ){
                        this.types.push(type);
                        auxBuild_types.push(type.id);
                    }
                }
            
            var tempJob = {};
            // Remove keys to normalize jobs Table
            for ( let key of Object.keys(job) ){
                if ( !keys_to_remove_from_jobs.includes(key) ){ tempJob[key] = job[key] };
            }
            this.jobs.push(tempJob);
        }

        // Set inital filter considering all values
            function getIds(itens){
                return itens.map( (item) => {
                    return item.id
                })
            }
            this.filters = {
                cities: getIds(this.cities),
                organizations: getIds(this.organizations),
                categories: getIds(this.categories),
                subCategories: getIds(this.subCategories),
                roles: getIds(this.roles),
                benefits: getIds(this.benefits),
                types: getIds(this.types)
            }

        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.buildFilterTable = this.buildFilterTable.bind(this);
        this.search = this.search.bind(this);

    }

    handleFilterChange(item, values){
        this.filters[item] = values;
        console.log(`JB Filter in ${ item }: `, this.filters[item]);
        this.propagationFilterChanges();
    }

    buildFilterTable(item){
        return this.filters[item].map( (i) => {
            return {id: i}
        })
    }

    search(){
        console.log("JB Search");
        const data = alasql(`
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

            LEFT JOIN ? as rel_jobs_and_roles
                ON rel_jobs_and_roles.jobId = job.id
            LEFT JOIN ? as role
                ON rel_jobs_and_roles.roleId = role.id

            LEFT JOIN ? as rel_jobs_and_categories
                ON rel_jobs_and_categories.jobId = job.id
            LEFT JOIN ? as category
                ON rel_jobs_and_categories.categoryId = category.id

            WHERE
                    category.id IN (SELECT id FROM ?)
        `, [ 
            this.rel_jobs_and_organizations ,
            this.jobs,
            this.organizations,
            this.rel_jobs_and_roles,
            this.roles,
            this.rel_jobs_and_categories,
            this.categories,
            this.buildFilterTable('categories') 
        ]);
        return data
    }
}