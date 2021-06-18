import Image from 'next/image';
import styles from './Accordion.module.scss';
import { useState } from 'react';

export function Accordion( props ){
    const [display, setDisplay] = useState(props.actived ? true : false);

    const handleDisplay = () => {
        setDisplay(!display);
    }

    const ICON_more = "/imgs/more.png";
    const ICON_less = "/imgs/less.png";
    
    return(
        <div className={ styles.Accordion }>
            <div className={ styles.AccordionHeader } onClick={ handleDisplay }>
                <div>
                    <img
                        src={ display ? ICON_less : ICON_more }    
                    />
                </div>
                <p>{ props.title }</p>
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

export function AccordionGroup( props ){
    return(
        <div className={ styles.AccordionGroup }>
            { props.children }
        </div>
    )
}