import { Stats } from "../../../pages/api/JSONStructure";
import  { Element, Path, RelicType, MultipliersInterface} from "../SharedTypes"

interface addEffect{
    addEffectGlobal(stats:Stats, effectList:string[], effect:SpecialEffects): void;
    addEffectFollowUp?(stats:Stats, effectList:string[], effect:SpecialEffectsLocal):void;
    addEffectUltimate?(stats:Stats, effectList:string[], effect:SpecialEffectsLocal):void;
    addEffectSkill?(stats:Stats, effectList:string[], effect:SpecialEffectsLocal):void;
    addEffectBasicAttack?(stats:Stats, effectList:string[], effect:SpecialEffectsLocal):void;
}

interface addEffectTeam{
    addTeamEffectGlobal?(stats:Stats, effectList:string[], effect:TeamSpecialEffects,): void;
    addTeamEffectFollowUp?(stats:Stats, effectList:string[], effect:TeamSpecialEffectsLocal):void;
    addTeamEffectUltimate?(stats:Stats, effectList:string[], effect:TeamSpecialEffectsLocal):void;
    addTeamEffectSkill?(stats:Stats, effectList:string[], effect:TeamSpecialEffectsLocal):void;
    addTeamEffectBasicAttack?(stats:Stats, effectList:string[], effect:TeamSpecialEffectsLocal):void;
}

//this should be constructed outside of the character 
//this should keep track of all global effect

//This class should be used for support characters
//This Effects should be shared among the entire team.
class TeamSpecialEffects{
    boostMultiplierIncrease:number
    vulnerabilityMultiplierIncrease:number
    defReduction:number
    resMultiplierIncrease:number
    toughnessMultiplier:number
    constructor(boostMultiplierIncrease:number = 0, vulnerabilityMultiplierIncrease:number = 0, defReduction:number = 0, resMultiplierIncrease:number = 0, toughnessMultiplier:number = 0.9){
        this.boostMultiplierIncrease = boostMultiplierIncrease;
        this.vulnerabilityMultiplierIncrease = vulnerabilityMultiplierIncrease;
        this.defReduction = defReduction;
        this.resMultiplierIncrease = resMultiplierIncrease;
        this.toughnessMultiplier = toughnessMultiplier;
    }
}
// Team specialeffectsLocal
class TeamSpecialEffectsLocal{
    boostMultiplierIncrease:number
    vulnerabilityMultiplierIncrease:number
    defReduction:number
    resMultiplierIncrease:number
    toughnessMultiplier:number
    constructor(boostMultiplierIncrease:number = 0, vulnerabilityMultiplierIncrease:number = 0, defReduction:number = 0, resMultiplierIncrease:number = 0, toughnessMultiplier:number = 0.9){
        this.boostMultiplierIncrease = boostMultiplierIncrease;
        this.vulnerabilityMultiplierIncrease = vulnerabilityMultiplierIncrease;
        this.defReduction = defReduction;
        this.resMultiplierIncrease = resMultiplierIncrease;
        this.toughnessMultiplier = toughnessMultiplier;
    }
}

class SpecialEffects{
    boostMultiplierIncrease:number
    vulnerabilityMultiplierIncrease:number
    defReduction:number
    resMultiplierIncrease:number
    toughnessMultiplier:number
    constructor(boostMultiplierIncrease:number = 0, vulnerabilityMultiplierIncrease:number = 0, defReduction:number = 0, resMultiplierIncrease:number = 0, toughnessMultiplier:number = 0.9){
        this.boostMultiplierIncrease = boostMultiplierIncrease;
        this.vulnerabilityMultiplierIncrease = vulnerabilityMultiplierIncrease;
        this.defReduction = defReduction;
        this.resMultiplierIncrease = resMultiplierIncrease;
        this.toughnessMultiplier = toughnessMultiplier;
    }
}

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

//this should be constructed for each skill
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

    constructor(element:Element, stats:Stats, skillMultiplier:number, effects:SpecialEffectsLocal, level:number, targetCount:number, enemyLevel:number = 80){
        this.attack = stats.attackFinal
        this.skillMultiplier = skillMultiplier;
        this.critMultiplier = 1+stats.criticalChance*stats.criticalDamage
        this.boostMultiplier = effects.boostMultiplierIncrease + 1 + getElementDamage(element, stats);
        this.vulnerabilityMultiplier = effects.vulnerabilityMultiplierIncrease+1;
        this.defMultiplier = (level+20)/((enemyLevel+20)*(1-effects.defReduction) + level + 20)
        this.resMultiplier = effects.resMultiplierIncrease+1;
        this.toughnessMultiplier = effects.toughnessMultiplier;
        this.targetCount = targetCount
    }

    public getDamage():number {
        return this.attack*this.skillMultiplier * this.critMultiplier*this.boostMultiplier*this.defMultiplier*this.resMultiplier*this.vulnerabilityMultiplier*this.toughnessMultiplier
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
export { SpecialEffects, Multipliers, SpecialEffectsLocal };
export type { Element, Path, addEffect, RelicType };
