import { FormattedRelic } from "../../pages/api/JSONStructureOwn";
import { MainStatType, SubStatType } from "./SharedTypes";
import getWeights from "./getWeight";
import factors from "./scoreFactor";

function getRate(score:number){
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

export default async function getSocre({relic,name}:{relic:FormattedRelic, name:string}){

    const weights = await getWeights(name);

    const subAffixList = relic.subAffix;
    const mainAffix = relic.mainAffix;
    let subScore = 0;
    for(let subAffix of subAffixList){
        const type = subAffix.type;
        const value = subAffix.value;
        const formattedValue = value < 1 ? value*100 : value
        const plain_type = parseSubStatsType(type);
        subScore += formattedValue * factors[plain_type] * weights[plain_type];
    }
    const main_type = mainAffix.type;
    const level = relic.level;
    const plain_main_type:formattedMainStatsType = parseMainStatsType(main_type);
    const relic_type = relic.type;

    const main_score1 =  ((relic_type === "OBJECT" || relic_type === "BODY") && weights[plain_main_type] !== 0)? level*2/3.0 : 0
    const main_score2 = (relic_type !== "HEAD" && relic_type !== "HAND")? 5.83 * weights[plain_main_type] : 0;

    let score = subScore +  main_score1 + main_score2;
    
    score = Math.floor(score*10)/10;
    const rate = getRate(score);

    //console.log(mainAffix)
    //console.log(subAffixList)
    //console.log(subScore)
    //console.log(main_score1)
    //console.log(main_score2)
    //console.log(score)

    return {score,rate};
}

type formattedSubStatsType = "ATK"| "DEF" | "HP" |
"Speed" | "CRIT Rate" | "CRIT DMG" | "Effect HIT Rate" | "Effect RES" | "Break Effect" 

function parseSubStatsType(type:SubStatType):formattedSubStatsType{
    if(type === "ATK%"){
        return "ATK"
    }
    if(type === "DEF%"){
        return "DEF"
    }
    if(type === "HP%"){
        return "HP"
    }
    return type
}

type formattedMainStatsType = "ATK"| "DEF" | "HP" |
"Speed" | "CRIT Rate" | "CRIT DMG" | "Effect HIT Rate" | "Effect RES" | "Break Effect" | "Element DMG" | "Energy Regen Rate" | "Outgoing Healing"

function parseMainStatsType(type:MainStatType):formattedMainStatsType{
    if(type === "ATK%"){
        return "ATK"
    }
    if(type === "DEF%"){
        return "DEF"
    }
    if(type === "HP%"){
        return "HP"
    }
    if(type === "Ice DMG" || type === "Imaginary DMG" || type === "Lightning DMG" || type === "Physical DMG" || type == "Quantum DMG" || type == "Wind DMG" || type == "Fire DMG"){
        return "Element DMG"
    }
    return type
}