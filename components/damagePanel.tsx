import React from "react";
import { MultipliersInterface } from "../utils/starrail/SharedTypes";
import { Collapse } from "react-daisyui";

function HiddenInfo(multipliers:MultipliersInterface,localEffect:string[],globalEffect:string[]){
    return(
        <div className="card">
            aaa
        </div>
    )
}

export default function SkillStats({skillName, skillValue}:{skillName:string,skillValue:string}){
    return(
        <div className="stats shadow">
            <div className="stat place-items-center bg-primary text-silver border border-silver">
                <div className="stat-title">{skillName}</div>
                <div className="stat-value">{skillValue}</div>
            </div>
        
        </div>
    )
}