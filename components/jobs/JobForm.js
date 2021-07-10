import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { string_to_slug } from '../../tools';

export default function JobForm(props) {
    const router = useRouter();

    const [search, setSearch] = useState(undefined);
  
    const handleSearchChange = event => {
        setSearch(event.target.value);
    }

    const getTitle = () => {
        return props.title ? <p element="title">{ props.title }</p> : <></>
    }

    const handleFormSubmit = event => {
        event.preventDefault();
        const uri = search.replaceAll(' ','-').replaceAll(/-{2,}/g,'-');
        router.push(`/vagas/${uri}`);
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
                <input type="submit" value="Pesquisar"></input>
            </form>     
        </div>
    )
}