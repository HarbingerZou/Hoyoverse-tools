//wrapper for clickablebutton
import { ReactElement, cloneElement } from "react";

interface FilterButtonProps<T> {
    children: ReactElement;
    value: T;
    state: T | null;
    setState: React.Dispatch<React.SetStateAction<T | null>>;
    allowDeselect?: boolean;
}

export default function FilterButton<T>({children,value,state,setState,allowDeselect}:FilterButtonProps<T>){
    function buttonClicked(){
        if(allowDeselect){
            if(value === state){
                setState(null)
            }else{
                setState(value);
            }
        }else{
            setState(value);
        }
    }
    

    const existingClassName = children.props.className || '';
    const isSelected = value === state;
    const newClassName = `${existingClassName} ${isSelected ? 'bg-secondary' : ''}`.trim();

    const enhancedChild = cloneElement(children, {
        onClick: buttonClicked,
        className: newClassName, // Combine the existing and new className
        'aria-pressed': isSelected
    });

    return enhancedChild;
}