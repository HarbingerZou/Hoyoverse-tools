import { Element, RelicType } from "./starrail/SharedTypes";
import { MainStatType, SubStatType } from "./starrail/SharedTypes";
function elementMapper(element:Element):string{
    switch (element) {
        case "elec":
            return "Lightning";
        case "imaginary":
            return "Imaginary";
        case "wind":
            return "Wind";
        case "fire":
            return "Fire";
        case "ice":
            return "Ice";
        case "quantum":
            return "Quantum";
        case "physical":
            return "Physical"
        default:
            return "Undefined";
    }
}

function parseType(type:RelicType):string{
    switch (type) {
        case "HEAD":
            return "Head";
        case "HAND":
            return "Hand";
        case "BODY":
            return "Body";
        case "FOOT":
            return "Foot";
        case "NECK":
            return "Planar Sphere";
        case "OBJECT":
            return "Link Rope";
        default:
            return "Undefined";
    }
    
}

//This method helps parse the stats to the correct filename for relic view stat icon display
function parseStat(stat:MainStatType|SubStatType):string{
    return stat.replace("%","")
}

function parseValue(value:number, type:MainStatType|SubStatType):string{
    let valueString
    if(value < 1){
        valueString = (Math.floor(value*1000)/10).toString()+"%";
    }else{
        if(type === "Speed"){
            valueString = (Math.floor(value*10)/10).toString();
        }else{
            valueString = Math.floor(value).toString();
        }
    }
    return valueString
    
}
export {elementMapper, parseType, parseStat, parseValue}