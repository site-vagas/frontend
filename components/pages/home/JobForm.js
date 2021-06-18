import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './JobForm.module.scss';
import { string_to_slug } from './../../../tools';

export default function JobForm(props) {
    const router = useRouter();

    const [search, setSearch] = useState(undefined);
    const [region, setRegion] = useState(undefined);
    
    const handleSearchChange = event => {
        console.log('Search: ', event.target.value);
        setSearch(event.target.value);
    }

    const handleRegionChange = event => {
        console.log('Region Searched: ', event.target.value);
        setRegion(event.target.value);
    }

    const handleFormSubmit = event => {
        event.preventDefault();
        const preSlug = `${ search } ${ region ? "em": "" } ${region ? region : ""}`;
        const slug = string_to_slug(preSlug); 
        router.push(`http://localhost:3000/vagas/${ slug }`);
    }

    const getRegionOptions = () => {

        function RegionOptionItem(props){
            var regionValue; 
            if ( props.region.city !== null && props.region.city !== null && props.region.city !== "" ){
                regionValue = `${props.region.city} - ${props.region.state}`;
            } else {
                regionValue = `${props.region.state} - ${props.region.country}`;
            }
            return(
                <option value={ regionValue }/>
            )
        }

        if ( region !== undefined && region !== null && region.replace(" ", "") !== "" ){
            const data = props.allRegions.map( (regionOption, key) =>{
                if( 
                        regionOption.city.toLocaleLowerCase().includes( region.toLocaleLowerCase() )
                    ||  regionOption.state.toLocaleLowerCase().includes( region.toLocaleLowerCase() )
                    ||  regionOption.country.toLocaleLowerCase().includes( region.toLocaleLowerCase() )
                ){
                    return <RegionOptionItem key={key} region={regionOption}/>
                }
            });

            return data.slice(0, 5)
        } else {
            return <></>
        }
    }

    return(
        <div className={ styles.JobForm }>
            <h1>Tickun</h1>
            <p>Encontre a vaga ideal com Você</p>
            <form onSubmit={handleFormSubmit}>
                <input
                    name="search"
                    type="text"
                    value={ search }
                    placeholder="Pesquise por um cargo"
                    onChange={ handleSearchChange }
                    required/>

                <input
                    name="region"
                    type="text"
                    value={ region }
                    placeholder="Informe uma cidade ou estado"
                    list="regionsList"
                    onChange={ handleRegionChange }
                    required/>

                <datalist id="regionsList">
                    { getRegionOptions() }
                </datalist>
                
                <input type="submit" value="Pesquisar"></input>
            </form>     
        </div>
    )
}