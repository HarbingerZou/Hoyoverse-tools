import { Element, Path, Stats,SpecialEffects,addEffect,Multipliers} from "./CommonInterfaces"
import { Weapon } from "./WeaponFactory";
//just to store passed in Json
interface rawCharacter {
    id: number;
    level:number;
    basic_level: number;
    skill_level: number;
    ultimate_level: number;
    talent_level:number
    trace1: boolean;
    trace2:boolean;
    trace3:boolean;
}

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

interface Character extends addEffect{
    name:string;
    path:Path;
    element:Element;
    level:number;
    basic_level: number;
    skill_level: number;
    ultimate_level: number;
    talent_level: number;

    //use ang instead of number for multiple value store
    //Example Dan Heng
    basic_data:any[];
    skill_data:any[];
    ultimate_data:any[];
    talent_data:any[];

    trace1:boolean;
    trace2:boolean;
    trace3:boolean;

    //eidolon?: number;

    getInfo1(stats:Stats, effect: SpecialEffects, weapon:Weapon):Info|undefined;
    getInfo2(stats:Stats, effect: SpecialEffects, weapon:Weapon):Info|undefined;
    getInfo3(stats:Stats, effect: SpecialEffects, weapon:Weapon):Info|undefined;
}

class Dan_Heng_IL implements Character{
    name: string;
    path: Path;
    element: Element;
    level: number;
    basic_level: number;
    skill_level: number;
    ultimate_level: number;
    talent_level: number;

    //basic for Fulgurant Leap
    basic_data:number[][];
    
    //skill for Dracore Libre
    skill_data:number[];
    ultimate_data:number[];
    talent_data: number[];
    trace1: boolean;
    trace2: boolean;
    trace3: boolean;

    //eidolon: number;

    constructor(level:number, basic_level:number, skill_level:number, ultimdate_level:number, talent_level:number, trace1:boolean, trace2:boolean, trace3:boolean){
        this.name = "Dan Heng IL";
        this.path = "destruction";
        this.element = "imaginary";
        this.level = level;
        this.basic_level = basic_level;
        this.skill_level = skill_level;
        this.ultimate_level = ultimdate_level;
        this.talent_level = talent_level;
        this.basic_data = [[1.9,2.5],[2.28,3],[2.66,3.5],[3.04,4],[3.42,4.5],[3.8,5], [4.18,5.5]]
        this.skill_data = [0.06, 0.066, 0.072, 0.078, 0.084, 0.09, 0.0975, 0.105, 0.1125, 0.12, 0.126, 0.132];
        this.ultimate_data = [1.8, 1.92, 2.04, 2.16, 2.28, 2.4, 2.55, 2.7, 2.85, 3, 3.12, 3.24];
        this.talent_data = [0.05, 0.055, 0.06, 0.065, 0.07, 0.075, 0.08125, 0.0875, 0.09375, 0.1, 0.105, 0.11]
        
        this.trace1 = trace1;
        this.trace2 = trace2;
        this.trace3 = trace3;

        //this.eidolon = eidolon;
    }
    


    addEffectGlobal(stats: Stats, effectList:string[]): void {
        if(this.trace3){
            stats.criticalDamage += 0.24;
            effectList.push("Jolt Anew: This character's CRIT DMG increases by 24% when dealing DMG to enemy targets with Imaginary Weakness.");
        }
    }

    getInfo1(stats:Stats, effect:SpecialEffects, weapon:Weapon): Info {
        const effectList:string[] = []
        //construct the multiplier for this skill
        const multipliers:Multipliers = new Multipliers(stats.attackFinal, this.basic_data[this.basic_level][0],stats.criticalChance, stats.criticalDamage, effect, this.level, 1.32)
        
        const statsLocal:Stats = JSON.parse(JSON.stringify(stats));
        //add weapon local effect
        if(weapon!== undefined && typeof weapon.addEffectBasicAttack === "function" && weapon.path === this.path){
            weapon.addEffectBasicAttack(statsLocal, effectList, multipliers);
        }

        //add charactrer local effect
        const criticalDamageIncrease:number = 2.2*this.skill_data[this.skill_level];
        statsLocal.criticalDamage += criticalDamageIncrease;
        effectList.push(`Dracore Libre: CRIT DMG increase by ${criticalDamageIncrease*100}%`)
        multipliers.boostMultiplier += 0.3;
        effectList.push(`Righteous Heart: Damage increase by 30%`)
        //add Relic Effecr
        //TODO

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

function getCharacter(characterInfo:rawCharacter) : Character| undefined{
    if(characterInfo.id === 1213){
        return new Dan_Heng_IL(characterInfo.level, characterInfo.basic_level, characterInfo.skill_level, characterInfo.ultimate_level, characterInfo.talent_level,
            characterInfo.trace1,characterInfo.trace2,characterInfo.trace3);

    }
    return undefined

}

export { Info, getCharacter };
export type { rawCharacter, Character };