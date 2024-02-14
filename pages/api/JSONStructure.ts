import { RelicType, Element } from "../../utils/starrail/Factories/CommonInterfaces";
interface AvatarConfig{
    id:number,
    name:string,
    element:Element;
}

//represent the AffixConfig Object in database
interface AffixConfig{
    [key:string]:string
}
interface RawSubAffix{
    info:RawAffix,
    count:number,
    step:number,
}
//same
interface RelicConfig{
    [key:string]:RelicConfigInstance
}
interface RelicConfigInstance{
    ID:number,
    SetID:number,
    Rarity:string,
    Type:RelicType
}
interface RawCharacter {
    id: number;
    level:number;
    rank:number;
    basic_level: number;
    skill_level: number;
    ultimate_level: number;
    talent_level:number
    trace1: boolean;
    trace2:boolean;
    trace3:boolean;
}
//same
interface SetConfig{
    [key:string]:string
}

interface RawAffix{
    id:number,
    type:number,
    value:number
}

interface RawSubAffix{
    info:RawAffix,
    count:number,
    step:number,
}
interface RawRelic{
    id:number;
    level:number;
    mainAffix:RawAffix;
    subAffixList:RawSubAffix[];
}

interface RawSkill{
    id:number,
    level:number
}

interface Factors {
    HP: number;
    ATK: number;
    DEF: number;
    "HP%": number;
    "ATK%": number;
    "DEF%": number;
    "CRIT Rate": number;
    "CRIT DMG": number; 
    "Effect HIT Rate": number; 
    "Effect RES": number; 
    "Break Effect": number; 
    Speed: number; 
}
interface RawWeapon{
    id:number;
    level:number;
    promotion:number;
    rankLevel: number;
}

interface Stats {
    hpBase: number;
    hpFinal: number;
    attackBase: number;
    attackFinal: number;
    defenseBase: number;
    defenseFinal: number;
    speedBase: number;
    speedFinal: number;
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
}


export type {
    AvatarConfig,
    AffixConfig,
    SetConfig,
    RelicConfig,
    RawRelic,
    RawAffix,
    RawSubAffix,
    RawCharacter,
    RawWeapon,
    RawSkill,
    Factors,
    Stats
}

