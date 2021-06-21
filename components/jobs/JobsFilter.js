import MultiSelector from './../../components/general/multiSelector/MultiSelector';
import { AccordionGroup, Accordion } from './../../components/general/Accordion/Accordion';

export default function JobsFilter(props){

    const handleSelection_State = (itens) => { props.changesHandler( 'state', itens ) }
    const handleSelection_City = (itens) => { props.changesHandler( 'city', itens ) }
    const handleSelection_Organization = (itens) => { props.changesHandler( 'organization', itens ) }
    const handleSelection_Category = (itens) => { props.changesHandler( 'category', itens ) }
    const handleSelection_SubCategory = (itens) => { props.changesHandler( 'subCategory', itens ) }
    const handleSelection_Benefit = (itens) => { props.changesHandler( 'benefit', itens ) }
    const handleSelection_Role = (itens) => { props.changesHandler( 'role', itens ) }
    const handleSelection_Type = (itens) => { props.changesHandler( 'type', itens ) }

    return (
        <div className={ props.className }>
            <div>
                <p>Filtre as Vagas</p>
                <p onClick={ props.handleClose }>X</p>
            </div>
            
            <p item="clearFilter" onClick={ props.clearFilter }>Limpar Filtro</p>

            <AccordionGroup>
            <Accordion title="Estados" actived={ true }>
                    <MultiSelector
                        name="job_state"
                        itens={ props.state.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.state.selected }
                        propagationFunction={ handleSelection_State }
                    />
                </Accordion>
                
                <Accordion title="Cidades">
                    <MultiSelector
                        name="job_city"
                        itens={ props.city.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.city.selected }
                        propagationFunction={ handleSelection_City }
                    />
                </Accordion>

                <Accordion title="Empresas">
                    <MultiSelector
                        name="job_organization"
                        itens={ props.organization.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.organization.selected }
                        propagationFunction={ handleSelection_Organization }
                    />
                </Accordion>

                <Accordion title="Categorias">
                    <MultiSelector
                        name="job_category"
                        itens={ props.category.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.category.selected }
                        propagationFunction={ handleSelection_Category }
                    />
                </Accordion>

                <Accordion title="Sub Categorias">
                    <MultiSelector
                        name="job_subCategory"
                        itens={ props.subCategory.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.subCategory.selected }
                        propagationFunction={ handleSelection_SubCategory }
                    />
                </Accordion>

                <Accordion title="Benefícios">
                    <MultiSelector
                        name="job_benefit"
                        itens={ props.benefit.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.benefit.selected }
                        propagationFunction={ handleSelection_Benefit }
                    />
                </Accordion>

                <Accordion title="Posição">
                    <MultiSelector
                        name="job_role"
                        itens={ props.role.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.role.selected }
                        propagationFunction={ handleSelection_Role }
                    />    
                </Accordion>
                
                <Accordion title="Tipos">
                    <MultiSelector
                        name="job_type"
                        itens={ props.type.itens }
                        itemKey="id"
                        itemName="name"
                        selectedItens={ props.type.selected }
                        propagationFunction={ handleSelection_Type }
                    />  
                </Accordion>
            </AccordionGroup>
        </div>
    )
}