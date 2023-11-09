import getWeights from "./getWeight";
import factors from "./scoreFactor";

function getRate(score){
    if(score >= 40){
        return "SSS"
    }
    if(score>=35){
        return "SS"
    }
    if(score>=30){
        return "S"
    }
    if(score>=25){
        return "A"
    }
    if(score>=20){
        return "B"
    }
    if(score>=12){
        return "C"
    }
    return "D";
}

export default async function getSocre({relic,name}){

    const weights = await getWeights(name);

    const subAffixList = relic.subAffix;
    const mainAffix = relic.mainAffix;
    let score = 0;
    for(let subAffix of subAffixList){
        const type = subAffix.type;
        //value is a String
        const value = subAffix.valueString;
        const plain_type = parseType(type);
        const plain_value = value.replace("%", "");
        score += plain_value * factors[type] * weights[plain_type];
    }
    const main_type = mainAffix.type;
    const level = relic.level;
    const plain_main_type = parseType(main_type);
    const relic_type = relic.type;

    const main_score1 =  ((relic_type === "Planar Sphere" || relic_type === "Body") && weights[plain_main_type] !== 0)? level*2/3.0 : 0
    const main_score2 = (relic_type !== "Head" && relic_type !== "Hand")? 5.83 * weights[plain_main_type] : 0;

    score+= main_score1 + main_score2;
    
    score = Math.floor(score*10)/10;
    const rate = getRate(score);

    return {score,rate};
}


function parseType(type){
    type = type.replace("Lightning", "Element");
    type = type.replace("Fire", "Element");
    type = type.replace("Wind", "Element");
    type = type.replace("Quantum", "Element");
    type = type.replace("Physical", "Element");
    type = type.replace("Imaginary", "Element");
    type = type.replace("Ice", "Element");
    type = type.replace("%", "");
    return type;
}