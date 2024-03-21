import { AllTeamEffect, Context, addEffect } from "./CommonInterfaces";
import { AffixInterface, subAffixInterface, RelicInterface, RelicType } from "../SharedTypes";


class Relic implements RelicInterface{
    level:number;
    type:RelicType;
    setID:number
    setName:string;
    rarity:number;
    mainAffix:AffixInterface;
    subAffix:subAffixInterface[];
    constructor(level:number, type:RelicType, setID:number,  setName:string, rarity:number, mainAffix:AffixInterface){
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
    addEffect(effect: AllTeamEffect, context: Context): void {
        const currentCharacter = context.currentCharacter
        const currentCharacterEffect = effect.characterEffect.get(currentCharacter)
        if(currentCharacterEffect === undefined){
            return
        }

        currentCharacterEffect.globalEffect.statsBoost.criticalChance += 0.1
        currentCharacterEffect.globalEffect.statsBoost.criticalDamage += 0.2
        currentCharacterEffect.globalEffect.notes.push("Wastelander of Banditry Desert: When attacking debuffed enemies, the wearer's CRIT Rate increases by 10%, and their CRIT DMG increases by 20% against Imprisoned enemies.")

    }
}

class Rutilant_Arena implements RelicSet{
    setName: string;
    count: number;
    constructor(count:number){
        this.count = count;
        this.setName = "Rutilant Arena"
    }
    addEffect(effect: AllTeamEffect, context: Context): void {
        const currentCharacter = context.currentCharacter
        const currentCharacterEffect = effect.characterEffect.get(currentCharacter)
        if(currentCharacterEffect === undefined){
            return
        }
        if(context.stats.criticalChance>=0.7){
            currentCharacterEffect.basicAttackEffect.effect.boostMultiplierIncrease += 0.2
            currentCharacterEffect.basicAttackEffect.notes.push("Rutilant Arena: When the wearer's current CRIT Rate reaches 70% or higher, the wearer's Basic ATK and Skill DMG increase by 20%.")
            currentCharacterEffect.skillEffect.effect.boostMultiplierIncrease += 0.2     
            currentCharacterEffect.skillEffect.notes.push("Rutilant Arena: When the wearer's current CRIT Rate reaches 70% or higher, the wearer's Basic ATK and Skill DMG increase by 20%.")
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
export type { RelicSet };
