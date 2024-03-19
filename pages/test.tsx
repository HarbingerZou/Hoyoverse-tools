import {Accordion} from "react-daisyui";
import { Range } from "react-daisyui"
import { useState } from "react";
import {Join} from "react-daisyui";
import Collapse from "../components/collapse"
import SkillStats from "../components/damagePanel";
export default function(){
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the Collapse component's open/close state

    return(
        <div className="body">
            <SkillStats skillName="aa" skillValue="aa"/>
            <button className="btn">aaa</button>
            <Collapse title={'undefined'} optionalText={'undefined'} />

            <Range size="sm" />
        </div>
    )
}