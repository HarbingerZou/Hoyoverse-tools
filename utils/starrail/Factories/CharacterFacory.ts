import { SpecialEffects,addEffect,Multipliers, Context, AllTeamEffect, EffectsWithNotes} from "./CommonInterfaces"
//just to store passed in Json
import { RawCharacter, Stats } from "../../../pages/api/JSONStructure";

import { Element, Path, CharacterBriefInfo } from "../SharedTypes";
//notes for each skill
class Info{
    name:string;
    value:number;
    //for effect
    notes:string[];
    //multiplier
    multipliers:Multipliers;
    constructor(name:string, value:number, notes:string[], multipliers:Multipliers){
        this.name = name;
        this.value = value;
        this.notes = notes;
        this.multipliers = multipliers;
    }
}

abstract class Character<TBasic, TSkill, TUltimate, TTalent> implements addEffect,CharacterBriefInfo{
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

    //add the effect of passive, eidolon. etc
    addEffect(effect: AllTeamEffect, context: Context): void {
        throw new Error("Method not implemented.");
    }


    //can be modified to trigger team members effects
    abstract getInfo1(effect:AllTeamEffect, context:Context):Info|undefined;
    abstract getInfo2(effect:AllTeamEffect, context:Context):Info|undefined;
    abstract getInfo3(effect:AllTeamEffect, context:Context):Info|undefined;
    //abstract getInfo2(stats:Stats, effect: SpecialEffects, weapon:Weapon, relicSets: RelicSet[], context:Context):Info|undefined;
    //abstract getInfo3(stats:Stats, effect: SpecialEffects, weapon:Weapon, relicSets: RelicSet[], context:Context):Info|undefined;

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
    
    addEffect(effect: AllTeamEffect, context: Context): void {
        const currentCharacter = context.currentCharacter
        const currentCharacterEffect = effect.characterEffect.get(currentCharacter)
        if(currentCharacterEffect === undefined){
            return
        }
        if(this.trace3){
            currentCharacterEffect.globalEffect.statsBoost.criticalDamage += 0.24
            currentCharacterEffect.globalEffect.notes.push("Jolt Anew: This character's CRIT DMG increases by 24% when dealing DMG to enemy targets with Imaginary Weakness.");
        }

        const criticalDamageIncrease:number = 2.2*this.skill_data[this.skill_level-1];
        currentCharacterEffect.basicAttackEffect.statsBoost.criticalDamage += criticalDamageIncrease
        currentCharacterEffect.basicAttackEffect.notes.push(`Dracore Libre: CRIT DMG increase by ${criticalDamageIncrease*100}%`)
        
        currentCharacterEffect.basicAttackEffect.effect.boostMultiplierIncrease += 0.3;
        currentCharacterEffect.basicAttackEffect.notes.push(`Righteous Heart: Damage increase by 30%`)
    }

    getInfo1(effect:AllTeamEffect, context:Context): Info {
        const effectList:string[] = getSkillNotes(effect,context,"basic attack")
        //construct the multiplier for this skill
        
        const statsLocal = combineStats(effect,context,"basic attack")

        //add weapon local effect
        const effectLocal:SpecialEffects = combineEffect(effect,context,"basic attack")
        
        const multipliers:Multipliers = new Multipliers(this.element, statsLocal, this.basic_data[this.basic_level-1][0], effectLocal, this.level, 1.32)
        
        const value:number = multipliers.getDamage();
        const info:Info = new Info("Divine Spear", value, effectList, multipliers);
        return info
    }

    getInfo2(effect:AllTeamEffect, context:Context): Info | undefined{
        return undefined;
    }
    getInfo3(effect:AllTeamEffect, context:Context): Info | undefined{
        return undefined;
    }
}

type damageType = "basic attack" | "skill" | "ultimate" | "follow up"


function getAllEffects(effect:AllTeamEffect, context:Context, tag:damageType):EffectsWithNotes[]{
    const currentCharacter = context.currentCharacter
    const currentCharacterEffect = effect.characterEffect.get(currentCharacter)
    const effectsToAdd:EffectsWithNotes[] = []
    if(currentCharacterEffect === undefined){
        new Error("current character effect doesn't exist.");
        return effectsToAdd
    }
    let localEffect = currentCharacterEffect.basicAttackEffect
    if(tag === "skill"){
        localEffect = currentCharacterEffect.skillEffect
    }
    if(tag === "ultimate"){
        localEffect = currentCharacterEffect.ultimateEffect
    }
    if(tag === "follow up"){
        localEffect = currentCharacterEffect.followUpEffect
    }
    effectsToAdd.push(currentCharacterEffect.globalEffect)
    effectsToAdd.push(localEffect)


    //console.log(effect.characterEffect)
    //console.log(effect.teamGlobalEffect)
    for(const teammateEffect of effect.teamGlobalEffect.values()){
        let teammateEffectLocal = teammateEffect.basicAttackEffect
        if(tag === "skill"){
            teammateEffectLocal = currentCharacterEffect.skillEffect
        }
        if(tag === "ultimate"){
            teammateEffectLocal = currentCharacterEffect.ultimateEffect
        }
        if(tag === "follow up"){
            teammateEffectLocal = currentCharacterEffect.followUpEffect
        }
        effectsToAdd.push(teammateEffectLocal)
        effectsToAdd.push(teammateEffect.globalEffect)
    }

    return effectsToAdd
}

function getSkillNotes(effect:AllTeamEffect, context:Context, tag:damageType):string[]{
    const currentCharacter = context.currentCharacter
    const currentCharacterEffect = effect.characterEffect.get(currentCharacter)
    if(currentCharacterEffect===undefined){
        return []
    }

    let notes:string[] = []
    if(tag === "basic attack"){
        notes = currentCharacterEffect.basicAttackEffect.notes
    }
    if(tag === "skill"){
        notes = currentCharacterEffect.skillEffect.notes
    }
    if(tag === "ultimate"){
        notes = currentCharacterEffect.ultimateEffect.notes
    }
    if(tag === "follow up"){
        notes = currentCharacterEffect.followUpEffect.notes
    }
    return notes;
}

function combineEffect(effect:AllTeamEffect, context:Context, tag:damageType):SpecialEffects{
    const effectCombined = new SpecialEffects()
    const effectsToAdd = getAllEffects(effect,context,tag)
    //console.log(effectCombined)
    for(const effect of effectsToAdd){
        effectCombined.boostMultiplierIncrease += effect.effect.boostMultiplierIncrease
        effectCombined.defReduction += effect.effect.defReduction
        effectCombined.resMultiplierIncrease += effect.effect.resMultiplierIncrease
        effectCombined.toughnessMultiplierIncrease += effect.effect.toughnessMultiplierIncrease
        effectCombined.vulnerabilityMultiplierIncrease += effect.effect.vulnerabilityMultiplierIncrease
       // console.log(effectCombined)
    }
    return effectCombined
}   
function combineStats(effect:AllTeamEffect, context:Context, tag:damageType):Stats{
    //construct local copy of the base effect
    const stats = JSON.parse(JSON.stringify(context.stats));
    const effectsToAdd = getAllEffects(effect,context,tag)
    for(const effect of effectsToAdd){
        stats.attackFinal += effect.statsBoost.attack
        stats.defenseFinal += effect.statsBoost.defense
        stats.hpFinal += effect.statsBoost.hp
        stats.speedFinal += effect.statsBoost.speed
        stats.criticalChance += effect.statsBoost.criticalChance
        stats.criticalDamage += effect.statsBoost.criticalDamage

        stats.healRatio += effect.statsBoost.healRatio
        stats.stanceBreakRatio += effect.statsBoost.stanceBreakRatio
        stats.statusResistance += effect.statsBoost.statusResistance
        stats.statusProbability += effect.statsBoost.statusProbability
        stats.spRatio += effect.statsBoost.spRatio

        stats.elecAddHurt += effect.statsBoost.elecAddHurt
        stats.fireAddHurt += effect.statsBoost.fireAddHurt
        stats.iceAddHurt += effect.statsBoost.iceAddHurt
        stats.imaginaryAddHurt += effect.statsBoost.imaginaryAddHurt
        stats.windAddHurt += effect.statsBoost.windAddHurt
        stats.physicalAddHurt += effect.statsBoost.physicalAddHurt
        stats.quantumAddHurt += effect.statsBoost.quantumAddHurt
    }
    return stats
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
