import { Stats } from './JSONStructure';
import { RawCharacter } from './JSONStructure';
import { RawWeapon } from './JSONStructure';
import { Factors } from './JSONStructure';
import { Element } from '../../utils/starrail/Factories/CommonInterfaces';
import { Affix , Relic } from '../../utils/starrail/Factories/RelicFactory';
import { CharacterInfo } from '../../utils/starrail/Factories/getDamageInfo';
import { Stat } from '../../utils/starrail/SharedTypes';

interface ForMattedAffix extends Affix{
    type:Stat,
    value:number,
    valueString:string
}

interface ForMattedSubAffix extends ForMattedAffix{
    type:Stat,
    count:number,
    value:number,
    valueString:string
}

class FormattedRelic extends Relic{
    level!: number;
    type!: string;
    setID!: number;
    setName!: string;
    rarity!: number;
    score:number|undefined;
    rate:string|undefined;
    mainAffix!: ForMattedAffix;
    subAffix!: ForMattedSubAffix[];
    constructor(level:number, type:string, setID:number,  set:string, rarity:number, mainAffix:ForMattedAffix){
        super(level, type, setID, set, rarity, mainAffix)
        this.score = undefined;
        this.rate = undefined;
    }
}


class CharacterWithStats implements RawCharacter{
    id: number;
    level: number;
    rank: number;
    basic_level: number;
    skill_level: number;
    ultimate_level: number;
    talent_level: number;
    trace1: boolean;
    trace2: boolean;
    trace3: boolean;

    name:string;
    element:Element;
    combatValues:Stats
    weapon:RawWeapon
    relics:FormattedRelic[]
    weights:Factors|undefined
    totalScore:number
    info:CharacterInfo|undefined

    constructor (rawCharacter:RawCharacter, name:string, element:Element, combatValues:Stats, weapon:RawWeapon){
        this.id = rawCharacter.id;
        this.totalScore = 0;
        this.level = rawCharacter.level;
        this.rank = rawCharacter.rank
        this.basic_level = rawCharacter.basic_level;
        this.skill_level = rawCharacter.skill_level;
        this.ultimate_level= rawCharacter.ultimate_level;
        this.talent_level = rawCharacter.talent_level;
        this.trace1 = rawCharacter.trace1;
        this.trace2 = rawCharacter.trace2;
        this.trace3 = rawCharacter.trace3;

        this.name = name;
        this.element = element;
        this.combatValues = combatValues;
        this.weapon = weapon;
        this.relics = [];
        this.weights = undefined
        this.totalScore = 0;
        this.info = undefined;
    }
}

class UserInfo{
    uid:number
    name:string
    level:number
    avatars:CharacterWithStats[]
    factors:Factors
    constructor(uid:number, name:string, level:number, avatars:CharacterWithStats[], factors:Factors){
        this.uid = uid
        this.name = name
        this.level = level
        this.avatars = avatars
        this.factors = factors
    }
}

export { FormattedRelic, CharacterWithStats, UserInfo };
export type { ForMattedAffix , ForMattedSubAffix};
