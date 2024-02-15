import { Element, Path, SpecialEffects,addEffect,Multipliers, SpecialEffectsLocal} from "./CommonInterfaces"
import { Weapon } from "./WeaponFactory";
//just to store passed in Json
import { RawCharacter, Stats } from "../../../pages/api/JSONStructure";
import { RelicSet } from "./RelicFactory";
//notes for each skill
class Info{
    name:string;
    value:string;
    //for effect
    notes:string[];
    //multiplier
    multipliers:Multipliers;
    constructor(name:string, value:string, notes:string[], multipliers:Multipliers){
        this.name = name;
        this.value = value;
        this.notes = notes;
        this.multipliers = multipliers;
    }
}

abstract class Character<TBasic, TSkill, TUltimate, TTalent> implements addEffect{
    name: string;
    path: Path;
    element: Element;
    level:number;
    basic_level: number;
    skill_level: number;
    ultimate_level: number;
    talent_level: number;

    //use ang instead of number for multiple value store
    //Example Dan Heng
    basic_data: TBasic;
    skill_data: TSkill;
    ultimate_data: TUltimate;
    talent_data: TTalent;

    trace1: boolean;
    trace2: boolean;
    trace3: boolean;

    eidolon: number;
    constructor(name:string, eidolon:number,  path:Path, element:Element, level:number,
            basic_level:number, skill_level:number, ultimdate_level:number, talent_level:number,
            trace1:boolean, trace2:boolean, trace3:boolean,
            basic_data: TBasic, skill_data: TSkill, ultimate_data: TUltimate, talent_data: TTalent
           ){
        this.name = name;
        this.eidolon = eidolon;
        this.path = path;
        this.element = element;
        this.level = level;
        this.basic_level = basic_level;
        this.skill_level = skill_level;
        this.ultimate_level = ultimdate_level;
        this.talent_level = talent_level;
        
        this.trace1 = trace1;
        this.trace2 = trace2;
        this.trace3 = trace3

        this.basic_data = basic_data
        this.skill_data = skill_data
        this.ultimate_data = ultimate_data
        this.talent_data = talent_data
    }

    abstract addEffectGlobal(stats: Stats, effectList: string[], effect: SpecialEffects): void 

    //can be modified to trigger team members effects
    abstract getInfo1(stats:Stats, effect: SpecialEffects, weapon:Weapon, relicSets: RelicSet[]):Info|undefined;
    abstract getInfo2(stats:Stats, effect: SpecialEffects, weapon:Weapon, relicSets: RelicSet[]):Info|undefined;
    abstract getInfo3(stats:Stats, effect: SpecialEffects, weapon:Weapon, relicSets: RelicSet[]):Info|undefined;


    addWeaponRelicEffectBasicAttack(weapon:Weapon|undefined, relicSets:RelicSet[], statsLocal:Stats, effectList:string[], effectLocal:SpecialEffectsLocal):void{
        if(weapon!== undefined && typeof weapon.addEffectBasicAttack === "function" && weapon.path === this.path){
            weapon.addEffectBasicAttack(statsLocal, effectList, effectLocal);
        }
        for(const relicSet of relicSets){
            if(typeof relicSet.addEffectBasicAttack === "function"){
                relicSet.addEffectBasicAttack(statsLocal, effectList, effectLocal);
            }
        }
    }
    addWeaponRelicEffectFollowUp(weapon:Weapon|undefined, relicSets:RelicSet[], statsLocal:Stats, effectList:string[], effectLocal:SpecialEffectsLocal):void{
        if(weapon!== undefined && typeof weapon.addEffectFollowUp === "function" && weapon.path === this.path){
            weapon.addEffectFollowUp(statsLocal, effectList, effectLocal);
        }
        for(const relicSet of relicSets){
            if(typeof relicSet.addEffectFollowUp === "function"){
                relicSet.addEffectFollowUp(statsLocal, effectList, effectLocal);
            }
        }
    }

    addWeaponRelicEffectSkill(weapon:Weapon|undefined, relicSets:RelicSet[], statsLocal:Stats, effectList:string[], effectLocal:SpecialEffectsLocal):void{
        if(weapon!== undefined && typeof weapon.addEffectSkill === "function" && weapon.path === this.path){
            weapon.addEffectSkill(statsLocal, effectList, effectLocal);
        }
        for(const relicSet of relicSets){
            if(typeof relicSet.addEffectSkill === "function"){
                relicSet.addEffectSkill(statsLocal, effectList, effectLocal);
            }
        }
    }

    addWeaponRelicEffectUltimate(weapon:Weapon|undefined, relicSets:RelicSet[], statsLocal:Stats, effectList:string[], effectLocal:SpecialEffectsLocal):void{
        if(weapon!== undefined && typeof weapon.addEffectUltimate === "function" && weapon.path === this.path){
            weapon.addEffectUltimate(statsLocal, effectList, effectLocal);
        }
        for(const relicSet of relicSets){
            if(typeof relicSet.addEffectUltimate === "function"){
                relicSet.addEffectUltimate(statsLocal, effectList, effectLocal);
            }
        }
    }
}

class Dan_Heng_IL extends Character<number[][], number[], number[], number[]> {
    constructor(level: number, eidolon: number, basic_level: number, skill_level: number, ultimate_level: number, talent_level: number, trace1: boolean, trace2: boolean, trace3: boolean) {
        const name: string = "Dan Heng IL";
        const path: Path = "destruction"; 
        const element: Element = "imaginary"; 
        
        // Basic for Fulgurant Leap
        const basic_data: number[][] = [[1.9,2.5],[2.28,3],[2.66,3.5],[3.04,4],[3.42,4.5],[3.8,5], [4.18,5.5]];
        
        // Skill for Dracore Libre
        const skill_data: number[] = [0.06, 0.066, 0.072, 0.078, 0.084, 0.09, 0.0975, 0.105, 0.1125, 0.12, 0.126, 0.132];
        const ultimate_data: number[] = [1.8, 1.92, 2.04, 2.16, 2.28, 2.4, 2.55, 2.7, 2.85, 3, 3.12, 3.24];
        const talent_data: number[] = [0.05, 0.055, 0.06, 0.065, 0.07, 0.075, 0.08125, 0.0875, 0.09375, 0.1, 0.105, 0.11]
       
        super(name, eidolon,  path, element, level,
            basic_level, skill_level, ultimate_level, talent_level,
            trace1, trace2, trace3,
            basic_data, skill_data, ultimate_data, talent_data
           ) 
    }
    


    addEffectGlobal(stats: Stats, effectList:string[]): void {
        if(this.trace3){
            stats.criticalDamage += 0.24;
            effectList.push("Jolt Anew: This character's CRIT DMG increases by 24% when dealing DMG to enemy targets with Imaginary Weakness.");
        }
    }

    getInfo1(stats:Stats, effect:SpecialEffects, weapon:Weapon|undefined, relicSets:RelicSet[]): Info {
        const effectList:string[] = []
        //construct the multiplier for this skill
        
        const statsLocal:Stats = JSON.parse(JSON.stringify(stats));

        //add weapon local effect
        const effectLocal:SpecialEffectsLocal = new SpecialEffectsLocal(effect);
        
        this.addWeaponRelicEffectBasicAttack(weapon, relicSets, statsLocal,effectList,effectLocal)
        //add charactrer local effect
        const criticalDamageIncrease:number = 2.2*this.skill_data[this.skill_level-1];
        statsLocal.criticalDamage += criticalDamageIncrease;
        effectList.push(`Dracore Libre: CRIT DMG increase by ${criticalDamageIncrease*100}%`)
        effectLocal.boostMultiplierIncrease += 0.3;
        effectList.push(`Righteous Heart: Damage increase by 30%`)
   
        
        const multipliers:Multipliers = new Multipliers(this.element, statsLocal, this.basic_data[this.basic_level-1][0], effectLocal, this.level, 1.32)
        
        const value:string = multipliers.getDamage().toString();
        const info:Info = new Info("Divine Spear", value, effectList, multipliers);
        return info
    }

    getInfo2(stats:Stats): Info | undefined{
        return undefined;
    }
    getInfo3(stats:Stats): Info | undefined{
        return undefined;
    }
}

function getCharacter(characterInfo:RawCharacter) : Character<any[], any[], any[], any[]>| undefined{
    if(characterInfo.id === 1213){
        return new Dan_Heng_IL(characterInfo.level,characterInfo.rank ,characterInfo.basic_level, characterInfo.skill_level, characterInfo.ultimate_level, characterInfo.talent_level,
            characterInfo.trace1,characterInfo.trace2,characterInfo.trace3);

    }
    return undefined

}

export { Info, getCharacter };
export type { Character };
