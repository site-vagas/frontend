import { useEffect, useState } from "react";
import styles from './MultiSelector.module.scss';

export default function MultiSelector(props){

    const getItemByKey = (itemKey) => {
        for(let item of props.itens){
            if(item[props.itemKey] === itemKey){
                return item
            }
        }
    }

    const slugfy = (str) => {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
      
        // remove accents, swap ñ for n, etc
        var from = "ãàáäâèéëêìíïîõòóöôùúüûñç·/_,:;";
        var to   = "aaaaaeeeeiiiiõoooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
    
        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes
    
        return str
    }

    const [allItens, setAllItens] = useState( props.itens )
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredItens, setFilteredItens] = useState( props.itens )
    const [selectedItens, setSelectedItens] = useState( props.selectedItens )

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        const searchQuery_slug = slugfy(event.target.value);
        var new_filteredItens = [];
        if( event.target.value.replace(" ","") === "" ){
            setFilteredItens([...allItens]);
        } else {
            for( let item of allItens ){
                if( slugfy(item[props.itemValue]).includes(searchQuery_slug)){
                    new_filteredItens.push(item);
                    setFilteredItens( new_filteredItens )
                }
            }
        }
    }

    const setItensSelection = (itens) => {
        setSelectedItens([...itens]);
        props.propagationFunction([...itens]);
    }

    const handleItemSelection = (event) => {
        // Update the list of Selected Itens
        const itemKey = event.target.value;
        const selectedItens_Ids = selectedItens.map( i => ( i[props.itemKey] ));
        var new_selectedItens = [];

        if( selectedItens_Ids.includes(itemKey) ){
            for( let item of selectedItens ){
                if( !(item[props.itemKey] === itemKey) ){
                    new_selectedItens.push(item);
                }
            }
        } else {
            new_selectedItens = [...selectedItens];
            new_selectedItens.push( getItemByKey(itemKey) );
        }

        setItensSelection(new_selectedItens);
    }

    const handleSelectAll = () => {
        // Select All avaiable itens
        const filteredItens_Ids = filteredItens.map( i => (i[props.itemKey]));
        const selectedItens_Ids = selectedItens.map( i => ( i[props.itemKey] ));
        var new_selectedItens = [...selectedItens];
        for( let item of filteredItens_Ids ){
            if( !(selectedItens_Ids.includes(item)) ){
                new_selectedItens.push( getItemByKey(item) );
            }
        }
        setItensSelection(new_selectedItens);
    }

    const handleUnselectAll = () => {
        // Remove Selection of All Itens
        const filteredItens_id = filteredItens.map( item => (item[props.itemKey]));
        var new_selectedItens = [];
        for(let item of selectedItens){
            if( !filteredItens_id.includes(item[props.itemKey]) ){
                new_selectedItens.push(item);
            }
        }
        setItensSelection( new_selectedItens );
    }

    const getItens = () => {
        const itens = filteredItens.map( (item, key) => {
            let itemKey = item[props.itemKey];
            let itemValue = item[props.itemValue];
            return(
                <li key={ key }>
                    <input
                        type="checkbox"
                        id={ `${props.name}_${itemKey}` }
                        value={ itemKey }
                        checked={ selectedItens.map(i => (i[props.itemKey])).includes(itemKey) }
                        onChange={ handleItemSelection }
                    />
                    <label
                        htmlFor={ `${props.name}_${itemKey}` }
                    >
                        { itemValue }
                    </label>
                </li>
            )
        });

        return itens
    }

    useEffect(() => {
        const updateItenOnPropsChange = () => {
            setAllItens(props.itens);
            setSelectedItens(props.selectedItens);
        }
        updateItenOnPropsChange();
    })

    return(
        <div className={ styles.MultiSelector }>
            <div className={ styles.searchBar }>
                <input
                    type="text"
                    placeholder="Pesquise aqui"
                    value={ searchQuery }
                    onChange={ handleSearch }
                />
            </div>

            <div className={ styles.helpers }>
                <div>
                    <span
                        onClick={ handleSelectAll }
                    >
                        Selecionar Todos
                    </span>
                </div>

                <div>
                    <span
                        onClick={ handleUnselectAll }
                    >
                        Desmarcar Todos
                    </span>
                </div>
            </div>

            <div className={ styles.itens }>
                <ul>
                    { getItens() }
                </ul>
            </div>
        </div>
    )
}