import MultiSelector from './../../components/general/multiSelector/MultiSelector';
import { AccordionGroup, Accordion } from './../../components/general/Accordion/Accordion';

export default function JobsFilter(props){

    const handleSelection = (item, itens) => {
        props.changesHandler(item, itens);
    }

    const buildFilters = () => {
        const titles_fromTo = {
            'state':        'Estados',
            'city':         'Cidades',
            'organization': 'Empresas',
            'category':     'Categorias',
            'subCategory':  'SubCategorias',
            'benefit':      'Benefícios',
            'role':         'Posição',
            'type':         'Tipos'
        };

        var filters = [];
        var key = 0;
        for( let item of Object.keys(props.data) ) {
            if( props.filters.includes(item) ){
                filters.push(
                    <Accordion key={key} title={ titles_fromTo[item] } actived={ key === 0 }>
                        <MultiSelector
                            name={ `job_${ item }` }
                            itens={ props.data[item]['itens'] }
                            itemKey="id"
                            itemValue="name"
                            selectedItens={ props.data[item]['selected'] }
                            propagationFunction={ (itens) => { handleSelection(item, itens) } }
                        />
                    </Accordion>
                );
                key=key+1;
            }
        };
        return filters
    }

    return (
        <div className={ props.className }>
            <div>
                <p>Filtre as Vagas</p>
                <p onClick={ props.handleClose }>X</p>
            </div>
            
            <p item="clearFilter" onClick={ props.clearFilter }>Limpar Filtro</p>

            <AccordionGroup>
                { buildFilters() }
            </AccordionGroup>
        </div>
    )
}