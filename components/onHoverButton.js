import { useState, cloneElement } from "react";
import style from "./onHoverButton.module.css";

export default function OnHoverButtonWrapper({children}) {
    const [onHover, setOnHover] = useState(false);
    const state = onHover? "onHover":"";
    const existingClassName = children.props.className || "";
    // create a clone of children (which should be a single element) 
    // and add the onMouseEnter and onMouseLeave event handlers
    const enhancedChild = cloneElement(children, {
        onMouseEnter: ()=>setOnHover(true),
        onMouseLeave: ()=>setOnHover(false),
        className: `${style[state]} ${existingClassName}`
    });

    return enhancedChild;
}
