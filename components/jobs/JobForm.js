import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { string_to_slug } from '../../tools';

export default function JobForm(props) {
    const router = useRouter();

    const [search, setSearch] = useState(undefined);
    const [allRegions, setAllRegions] = useState([]);
    const [region, setRegion] = useState(undefined);
  
    useEffect(() => {
        fetch("https://site-vagas.herokuapp.com/jobs/regions", {
            headers: {"Bearer": process.env.API_BEARER_TOKEN}
        }).then( resp => {
            resp.json().then( regions => {
                
                var aux_allRegions = [];
                var aux_states = [];
                
                regions.map( ( regionOpt ) => {
                    aux_allRegions.push({
                        city: regionOpt.jobs_city,
                        state: regionOpt.jobs_state,
                        country: "Brasil"
                    });
            
                    if ( !aux_states.includes( regionOpt.jobs_state ) ){
                        aux_allRegions.push({
                            city: "",
                            state: regionOpt.jobs_state,
                            country: "Brasil"
                        })
                    };
                });
                setAllRegions( aux_allRegions );
            });
        })
    }, [])

    const handleSearchChange = event => {
        setSearch(event.target.value);
    }

    const handleRegionChange = event => {
        setRegion(event.target.value);
    }

    const handleFormSubmit = event => {
        event.preventDefault();
        const preSlug = `${ search } ${ region ? "em": "" } ${region ? region : ""}`;
        const slug = string_to_slug(preSlug); 
        router.push(`/vagas/${ slug }`);
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
            const data = allRegions.map( (regionOption, key) =>{
                if( 
                        regionOption.city.toLocaleLowerCase().includes( region.toLocaleLowerCase() )
                    ||  regionOption.state.toLocaleLowerCase().includes( region.toLocaleLowerCase() )
                    ||  regionOption.country.toLocaleLowerCase().includes( region.toLocaleLowerCase() )
                ){
                    return <RegionOptionItem key={key} region={regionOption}/>
                }
            });

            return data.slice(0, 10)
        } else {
            return <></>
        }
    }

    const getTitle = () => {
        return props.title ? <p element="title">{ props.title }</p> : <></>
    }

    return(
        <div element="JobForm">
            { getTitle() }
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