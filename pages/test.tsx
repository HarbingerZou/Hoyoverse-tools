import {Accordion} from "react-daisyui";
import { Range } from "react-daisyui"
import { useState } from "react";
import {Join} from "react-daisyui";
import Collapse from "../components/collapse"
import SkillStats from "../components/damagePanel";
import FilterButton from "../components/filterButton";
export default function(){
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    
    // Function to toggle the Collapse component's open/close state

    return(
        <div className="body">
            <SkillStats skillName="aa" skillValue="aa"/>
            <button className="btn">aaa</button>
            <FilterButton
                value="Option1"
                state={selectedValue}
                setState={setSelectedValue}
                allowDeselect={true}
            >
                <button>Option 1</button>
            </FilterButton>
            <Range size="sm" />
        </div>
    )
}