import { Multipliers, SpecialEffects, SpecialEffectsLocal, addEffect } from "./CommonInterfaces";
import { Stats } from "../../../pages/api/JSONStructure";
interface Affix{
    type:string,
    value:number,
}

class Relic{
    level:number;
    type:string;
    setID:number
    setName:string;
    rarity:number;
    mainAffix:Affix;
    subAffix:Affix[];
    constructor(level:number, type:string, setID:number,  setName:string, rarity:number, mainAffix:Affix){
        this.level = level;
        this.type = type;
        this.setName = setName;
        this.setID = setID;
        this.rarity = rarity;
        this.mainAffix = mainAffix;
        this.subAffix = [];
    }
}

interface RelicSet extends addEffect{
    count:number
    setName:string
}

class Wastelander_of_Banditry_Desert implements RelicSet{
    setName: string;
    count: number;
    constructor(count:number){
        this.count = count;
        this.setName = "Wastelander of Banditry Desert"
    }
    addEffectGlobal(stats: Stats, effectList: string[], effect: SpecialEffects): void {
        if(this.count >= 4){
            stats.criticalChance += 0.1
            stats.criticalDamage += 0.2
            effectList.push("Wastelander of Banditry Desert: When attacking debuffed enemies, the wearer's CRIT Rate increases by 10%, and their CRIT DMG increases by 20% against Imprisoned enemies.")
        }
    }  
}

class Rutilant_Arena implements RelicSet{
    setName: string;
    count: number;
    constructor(count:number){
        this.count = count;
        this.setName = "Rutilant Arena"
    }
    addEffectGlobal(stats: Stats, effectList: string[], effect: SpecialEffects): void {
        
    }
    addEffectBasicAttack(stats: Stats, effectList: string[], effect: SpecialEffectsLocal): void {
        if(stats.criticalChance >= 0.7){
            effect.boostMultiplierIncrease += 0.2;
            effectList.push("Rutilant Arena: When the wearer's current CRIT Rate reaches 70% or higher, the wearer's Basic ATK and Skill DMG increase by 20%.")
        }
    }
    addEffectSkill(stats: Stats, effectList: string[], effect: SpecialEffectsLocal): void {
        if(stats.criticalChance>=0.7){
            effect.boostMultiplierIncrease += 0.2;
            effectList.push("Rutilant Arena: When the wearer's current CRIT Rate reaches 70% or higher, the wearer's Basic ATK and Skill DMG increase by 20%.")
        }
    }
}

function getRelicSet(setID:number, count:number):RelicSet|undefined{
    if(setID === 112){
        return new Wastelander_of_Banditry_Desert(count);
    }
    if(setID === 309){
        return new Rutilant_Arena(count);
    }

    return undefined
}

function getRelicSetList(relicList:Relic[]):RelicSet[]{
    const RelicCounts:Map<number, number> = new Map();
    for(let relic of relicList){
        const count:number = RelicCounts.get(relic.setID) || 0
        RelicCounts.set(relic.setID, count+1);
    }
    const output:RelicSet[] = []
    for(const [ID, count] of RelicCounts){
        const set:RelicSet|undefined = getRelicSet(ID, count)
        if(set !== undefined){
            output.push(set);
        }
    }
    return output
}

export { Relic, getRelicSetList };
export type { Affix, RelicSet };
