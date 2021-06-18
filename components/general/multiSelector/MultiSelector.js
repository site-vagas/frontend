import React, { Component } from 'react';
import styles from './MultiSelector.module.scss';

export default class MultipleSelector extends Component {
    constructor(props){
        super(props)
        this.propagationFunction = this.props.propagationFunction;

        this.state = {
            name: this.props.name,
            searchQuery: "",
            allItens: this.props.itens,
            filteredItens: this.props.itens,
            selectedItens: this.props.selectedItens || [],
            
        };

        this.getItensList = this.getItensList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleItemSelection = this.handleItemSelection.bind(this);
    }

    componentDidUpdate(prevProps){
        if( this.props !== prevProps ){
            this.setState({
                allItens: this.props.itens,
                filteredItens: this.props.itens,
                selectedItens: this.props.selectedItens
            })
        }
    }
    
    handleItemSelection(event){
        var selectedItens = this.state.selectedItens;
        const eventValue = event.target.value.toString().toLocaleLowerCase();
        selectedItens.includes(eventValue) ? selectedItens = selectedItens.filter(item => { return  item !== eventValue }) : selectedItens.push(eventValue);
        this.propagationFunction(selectedItens);
        this.setState({selectedItens: selectedItens});
    }

    getItensList(){
        const selectedItens = this.state.selectedItens;
        const handleItemSelection = this.handleItemSelection;
        const listName = this.state.name;
        
        function ItemList (props){
            const itemSelected = selectedItens.includes(props.value.toString().toLocaleLowerCase());
            return (
                <li>
                    <input
                        type="checkbox"
                        value={props.value}
                        id={`${listName}_item_${props.value}`}
                        checked={ itemSelected }
                        onChange={ handleItemSelection }
                    />
                    <label htmlFor={`${listName}_item_${props.value}`}>{props.name}</label>
                </li>
            )
        }

        var itens = <></> 
        if ( this.state.filteredItens !== null &&  this.state.filteredItens !== undefined ){
            itens = this.state.filteredItens.map( (item, key) =>{
                return <ItemList key={ key } name={ item[this.props.itemName] } value={ item[this.props.itemKey] }/>
            })
        }

        return itens
    }

    handleSearch(event){
        const query = event.target.value;
        if( query !== "" && this.state.allItens !== null & this.state.allItens !== undefined) {
            function filter(Item){
                return Item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            }
    
            const filteredItens = this.state.allItens.filter( filter );
            this.setState({ filteredItens: filteredItens });
        } else {
            this.setState({ filteredItens: this.state.allItens });
        }
    }

    render(){
        return(
            <div className={ styles.MultipleSelector }>
                <div className={ styles.searchBar }>
                    <input type="text" placeholder="Pesquise aqui" onChange={ this.handleSearch }/>
                </div>

                <div className={ styles.itens }>
                    <ul>
                        { this.getItensList() }
                    </ul>
                </div>
            
            </div>
        )
    }
}