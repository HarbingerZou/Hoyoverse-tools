import { Stats } from './JSONStructure';
import { RawCharacter } from './JSONStructure';
import { RawWeapon } from './JSONStructure';
import { Factors } from './JSONStructure';
import { Element } from '../../utils/starrail/Factories/CommonInterfaces';
import { Affix , Relic } from '../../utils/starrail/Factories/RelicFactory';
import { CharacterInfo } from '../../utils/starrail/Factories/getDamageInfo';

interface ForMattedAffix extends Affix{
    type:string,
    value:number,
    valueString:string
}

class FormattedRelic extends Relic{
    level!: number;
    type!: string;
    setID!: number;
    set!: string;
    rarity!: number;
    score:number|undefined;
    rate:string|undefined;
    mainAffix!: ForMattedAffix;
    subAffix!: ForMattedAffix[];
    constructor(level:number, type:string, setID:number,  set:string, rarity:number, mainAffix:ForMattedAffix){
        super(level, type, setID, set, rarity, mainAffix)
        this.score = undefined;
        this.rate = undefined;
    }
}


class CharacterWithStats implements RawCharacter{
    id: number;
    level: number;
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

interface UserInfo{
    uid:number,
    name:string,
    level:number,
    avatars:CharacterWithStats[],
    factors:Factors
}

export { FormattedRelic, CharacterWithStats };
export type { ForMattedAffix, UserInfo };
