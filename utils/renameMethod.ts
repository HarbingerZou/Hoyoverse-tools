import { Element, RelicType } from "./starrail/Factories/CommonInterfaces";
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

export {elementMapper, parseType}