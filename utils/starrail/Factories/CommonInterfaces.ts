import { Stats } from "../../../pages/api/JSONStructure";

type Element = "elec" | "imaginary" | "wind"|"fire"| "ice" | "quantum" | "physical"
type Path =  "destruction" | "hunt" | "erudition" | "harmony" | "nihility" | "perservation" | "abundance"
type RelicType = "HEAD" | "HAND" | "BODY" |"FOOT" | "NECK" |"OBJECT"

interface addEffect{
    addEffectGlobal(stats:Stats, effectList:string[], effect:SpecialEffects): void;
    addEffectFollowUp?(stats:Stats, effectList:string[], multiplier:Multipliers):void;
    addEffectUltimate?(stats:Stats, effectList:string[], multiplier:Multipliers):void;
    addEffectSkill?(stats:Stats, effectList:string[], multiplier:Multipliers):void;
    addEffectBasicAttack?(stats:Stats, effectList:string[], multiplier:Multipliers):void;
}


//this should be constructed outside of the character 
//this should keep track of all global effect
class SpecialEffects{
    boostMultiplier:number
    vulnerabilityMultiplier:number
    defReduction:number
    resMultiplier:number
    toughnessMultiplier:number
    constructor(boostMultiplier:number = 1, vulnerabilityMultiplier = 1, defReduction = 0, resMultiplier = 1, toughnessMultiplier =1){
        this.boostMultiplier = boostMultiplier;
        this.vulnerabilityMultiplier = vulnerabilityMultiplier;
        this.defReduction = defReduction;
        this.resMultiplier = resMultiplier;
        this.toughnessMultiplier = toughnessMultiplier;
    }
}


//this should be constructed for each skill
class Multipliers{
    attack:number;
    skillMultiplier:number;
    critMultiplier:number
    boostMultiplier:number
    vulnerabilityMultiplier:number
    defMultiplier:number
    resMultiplier:number
    toughnessMultiplier:number
    targetCount:number

    constructor(attack:number, skillMultiplier:number, criticalChance: number,criticalDamage:number, effects:SpecialEffects, level:number, targetCount:number, enemyLevel:number = 80){
        this.attack = attack
        this.skillMultiplier = skillMultiplier;
        this.critMultiplier = 1+criticalChance*criticalDamage
        this.boostMultiplier = effects.boostMultiplier;
        this.vulnerabilityMultiplier = effects.vulnerabilityMultiplier;
        this.defMultiplier = (level+20)/((enemyLevel+20)*(1-effects.defReduction) + level + 20)
        this.resMultiplier = effects.resMultiplier;
        this.toughnessMultiplier = effects.toughnessMultiplier;
        this.targetCount = targetCount
    }

    public getDamage():number {
        return this.attack*this.skillMultiplier * this.critMultiplier*this.boostMultiplier*this.defMultiplier*this.resMultiplier*this.vulnerabilityMultiplier*this.toughnessMultiplier
    }
}


export { SpecialEffects, Multipliers };
export type { Element, Path, addEffect, RelicType };
