import MultiSelector from './../../components/general/multiSelector/MultiSelector';
import { AccordionGroup, Accordion } from './../../components/general/Accordion/Accordion';

export default function JobsFilter(props){

    const handleSelection_State = (itens) => { props.changesHandler( 'states', itens ) }
    const handleSelection_City = (itens) => { props.changesHandler( 'cities', itens ) }
    const handleSelection_Organization = (itens) => { props.changesHandler( 'organizations', itens ) }
    const handleSelection_Category = (itens) => { props.changesHandler( 'categories', itens ) }
    const handleSelection_Benefits = (itens) => { props.changesHandler( 'benefits', itens ) }
    const handleSelection_Roles = (itens) => { props.changesHandler( 'roles', itens ) }
    const handleSelection_Types = (itens) => { props.changesHandler( 'types', itens ) }

    return (
        <div className={ props.className }>
            <div>
                <p>Filtre as Vagas</p>
                <p onClick={ props.handleClose }>X</p>
            </div>
            
            <AccordionGroup>
            <Accordion title="Estados" actived={ true }>
                    <MultiSelector
                        name="job_states"
                        itens={ props.states.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.states.selected }
                        propagationFunction={ handleSelection_State }
                    />
                </Accordion>
                
                <Accordion title="Cidades">
                    <MultiSelector
                        name="job_cities"
                        itens={ props.cities.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.cities.selected }
                        propagationFunction={ handleSelection_City }
                    />
                </Accordion>

                <Accordion title="Empresas">
                    <MultiSelector
                        name="job_organizations"
                        itens={ props.organizations.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.organizations.selected }
                        propagationFunction={ handleSelection_Organization }
                    />
                </Accordion>

                <Accordion title="Categorias">
                    <MultiSelector
                        name="job_categories"
                        itens={ props.categories.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.categories.selected }
                        propagationFunction={ handleSelection_Category }
                    />
                </Accordion>

                <Accordion title="Benefícios">
                    <MultiSelector
                        name="job_benefits"
                        itens={ props.benefits.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.benefits.selected }
                        propagationFunction={ handleSelection_Benefits }
                    />
                </Accordion>

                <Accordion title="Posição">
                    <MultiSelector
                        name="job_roles"
                        itens={ props.roles.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.roles.selected }
                        propagationFunction={ handleSelection_Roles }
                    />    
                </Accordion>
                
                <Accordion title="Tipos">
                    <MultiSelector
                        name="job_types"
                        itens={ props.types.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.types.selected }
                        propagationFunction={ handleSelection_Types }
                    />  
                </Accordion>
            </AccordionGroup>
        </div>
    )
}