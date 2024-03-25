//This file includes all necessary common interfaces for backend
import { Stats } from "../../../pages/api/JSONStructure";
import  { Element, MultipliersInterface, CharacterBriefInfo} from "../SharedTypes"

//The stats is necessary becasue some effect such as element damage increase may not be applied finally
//Context is necessary because some effect, such as the new ornament in 2.1 depends on teammate Context
interface addEffect{
    addEffect(effect:AllTeamEffect, context:Context): void;
    //addEffectGlobal(stats:Stats, effectList:string[], effect:SpecialEffects, context:Context): void;
    //addEffectFollowUp?(stats:Stats, effectList:string[], effect:SpecialEffectsLocal, context:Context):void;
    //addEffectUltimate?(stats:Stats, effectList:string[], effect:SpecialEffectsLocal, context:Context):void;
    //addEffectSkill?(stats:Stats, effectList:string[], effect:SpecialEffectsLocal, context:Context):void;
    //addEffectBasicAttack?(stats:Stats, effectList:string[], effect:SpecialEffectsLocal, context:Context):void;
}



class SpecialEffects{
    boostMultiplierIncrease:number
    vulnerabilityMultiplierIncrease:number
    defReduction:number
    resMultiplierIncrease:number
    toughnessMultiplierIncrease:number
    constructor(boostMultiplierIncrease:number = 0, vulnerabilityMultiplierIncrease:number = 0, defReduction:number = 0, resMultiplierIncrease:number = 0, toughnessMultiplierIncrease:number = 0){
        this.boostMultiplierIncrease = boostMultiplierIncrease;
        this.vulnerabilityMultiplierIncrease = vulnerabilityMultiplierIncrease;
        this.defReduction = defReduction;
        this.resMultiplierIncrease = resMultiplierIncrease;
        this.toughnessMultiplierIncrease = toughnessMultiplierIncrease;
    }
}
/*
class SpecialEffectsLocal{
    boostMultiplierIncrease:number
    vulnerabilityMultiplierIncrease:number
    defReduction:number
    resMultiplierIncrease:number
    toughnessMultiplier:number
    constructor(globalEffect:SpecialEffects){
        this.boostMultiplierIncrease = globalEffect.boostMultiplierIncrease;
        this.vulnerabilityMultiplierIncrease = globalEffect.vulnerabilityMultiplierIncrease;
        this.defReduction = globalEffect.defReduction;
        this.resMultiplierIncrease = globalEffect.resMultiplierIncrease;
        this.toughnessMultiplier = globalEffect.toughnessMultiplier;
    }
}
*/
//The center of this architecture
class StatsBoost {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    criticalChance: number;
    criticalDamage: number;
    stanceBreakRatio: number;
    healRatio: number;
    spRatio: number;
    statusProbability: number;
    statusResistance: number;
    physicalAddHurt: number;
    fireAddHurt: number;
    iceAddHurt: number;
    elecAddHurt: number;
    windAddHurt: number;
    quantumAddHurt: number;
    imaginaryAddHurt: number;

    constructor() {
        this.hp = 0;
        this.attack = 0;
        this.defense = 0;
        this.speed = 0;
        this.criticalChance = 0;
        this.criticalDamage = 0;
        this.stanceBreakRatio = 0;
        this.healRatio = 0;
        this.spRatio = 0;
        this.statusProbability = 0;
        this.statusResistance = 0;
        this.physicalAddHurt = 0;
        this.fireAddHurt = 0;
        this.iceAddHurt = 0;
        this.elecAddHurt = 0;
        this.windAddHurt = 0;
        this.quantumAddHurt = 0;
        this.imaginaryAddHurt = 0;
    }
}

class EffectsWithNotes{
    statsBoost:StatsBoost
    effect:SpecialEffects
    notes:string[]
    constructor(){
        this.statsBoost = new StatsBoost()
        this.effect = new SpecialEffects();
        this.notes = []
    }
}
class SingleCharacterEffects{
    //condition:(context) => boolean
    //if condition === true, apply the following effect
    globalEffect:EffectsWithNotes
    followUpEffect:EffectsWithNotes
    ultimateEffect:EffectsWithNotes
    skillEffect:EffectsWithNotes
    basicAttackEffect:EffectsWithNotes
    constructor(){
        this.globalEffect = new EffectsWithNotes()
        this.followUpEffect = new EffectsWithNotes()
        this.ultimateEffect = new EffectsWithNotes()
        this.skillEffect = new EffectsWithNotes()
        this.basicAttackEffect = new EffectsWithNotes()
    }
}


class AllTeamEffect{
    //version 2.0
    //characterEffect:Map<CharacterBriefInfo, SingleCharacterEffects[]>

    //This stores the effects unique to each character
    characterEffect:Map<CharacterBriefInfo, SingleCharacterEffects>
    //The key should be a pointer to each character for verifying if the characterEffect is effective
    //This object should be unqiue fof the entire team
    //These are the effect that applied to all team members

    //version 2.0
    //teamGlobalEffect:Map<CharacterBriefInfo, SingleCharacterEffects[]>
    teamGlobalEffect:Map<CharacterBriefInfo, SingleCharacterEffects>

    constructor(){
        this.characterEffect = new Map();
        this.teamGlobalEffect = new Map();
    }

}   

//


//This is used when constructing displayed text
class Multipliers implements MultipliersInterface{
    attack:number;
    skillMultiplier:number;
    critMultiplier:number
    boostMultiplier:number
    vulnerabilityMultiplier:number
    defMultiplier:number
    resMultiplier:number
    toughnessMultiplier:number
    targetCount:number
    //The effects should be an aggregated effects ready for final multiplier construction
    constructor(element:Element, stats:Stats, skillMultiplier:number, effects:SpecialEffects, level:number, targetCount:number, enemyLevel:number = 80){
        this.attack = stats.attackFinal
        this.skillMultiplier = skillMultiplier;
        this.critMultiplier = 1+stats.criticalChance*stats.criticalDamage
        this.boostMultiplier = effects.boostMultiplierIncrease + 1 + getElementDamage(element, stats);
        this.vulnerabilityMultiplier = effects.vulnerabilityMultiplierIncrease+1;
        this.defMultiplier = (level+20)/((enemyLevel+20)*(1-effects.defReduction) + level + 20)
        this.resMultiplier = effects.resMultiplierIncrease+1;
        this.toughnessMultiplier = 0.9+effects.toughnessMultiplierIncrease;
        this.targetCount = targetCount
    }

    public getDamage():number {
        return this.attack*this.skillMultiplier * this.critMultiplier*this.boostMultiplier*this.defMultiplier*this.resMultiplier*this.vulnerabilityMultiplier*this.toughnessMultiplier*this.targetCount
    }
}

function getElementDamage(element:Element, stats:Stats){
    switch (element){
        case "elec":
            return stats.elecAddHurt;
        case "imaginary":
            return stats.imaginaryAddHurt;
        case "wind":
            return stats.windAddHurt;
        case "fire":
            return stats.fireAddHurt;
        case "ice":
            return stats.fireAddHurt;
        case "quantum":
            return stats.quantumAddHurt;
        case "physical":
            return stats.physicalAddHurt
    }
}

class Context{
    stats:Stats
    currentCharacter:CharacterBriefInfo
    teammates:CharacterBriefInfo[]
    constructor(stats:Stats, currentCharacter:CharacterBriefInfo, teammates:CharacterBriefInfo[]){
        this.stats = stats
        this.currentCharacter = currentCharacter
        this.teammates = teammates
    }
}

//EnemyContext
//Todo paid version

export { SpecialEffects, Multipliers, Context, AllTeamEffect, SingleCharacterEffects, EffectsWithNotes};
export type { addEffect};
