import styles from './Accordion.module.scss';
import { useState } from 'react';

export function Accordion(props){
    const [ display, setDisplay ] = useState(true);
    
    const progateSelection = () => {
        props.propagationFunction( props.itemKey )
    }

    ICON_more = "/public/imgs/filter.png";
    ICON_less = "/public/imgs/filter.png";
    return(
        <div className={ styles.Accordion }>
            <div className={ styles.AccordionHeader }>
                <p>{ props.title }</p>
                <img src={ display? ICON_less : ICON_more }/>
            </div>

            <div className={`${
                styles.AccordionBody
            } ${
                display ? styles.showBody : ""
            }`}>
                { props.children }
            </div>
        </div>
    )
}

export function AccordionGroup(props){
    
    // const [ selectedItens, setSelectedItens ] = useState( props.selectedItens );


    // const getAccordions = () => {​​​​​​​
    //     return props.children.map( (child, key) => {​​​​​​​
    //         return React.cloneElement(child, {​​​​​​​
    //             propagationFunction: handleAccordionSelection,
    //             actived: selectedItens.includes(  )
    //         }​​​​​​​)
    //     }​​​​​​​)
    // }​​​​​​​

    // props.children.map( (c, k ) =>{
    //     c.props["tt"] = k;
    //     console.log(c)
    // })

    return(
        <div className={styles.AccordionGroup}></div>
    )
}