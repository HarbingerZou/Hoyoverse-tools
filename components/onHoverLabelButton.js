import { useState, cloneElement } from "react";
import style from "./onHoverLabelButton.module.css";

export default function OnHoverLabelButtonWrapper({children, label}) {
    const [onHover, setOnHover] = useState(false);
    const className = onHover? "onHover" : "";

    return <div onMouseEnter={()=>{setOnHover(true)}} onMouseLeave={()=>setOnHover(false)}  className={`${style.button} ${style[className]}`}> 
                {label}
                {children}
            </div>;
}
