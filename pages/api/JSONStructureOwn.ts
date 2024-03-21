import { Stats } from './JSONStructure';
import { RawCharacter } from './JSONStructure';
import { RawWeapon } from './JSONStructure';
import { Factors } from './JSONStructure';
import { CharacterInfo } from '../../utils/starrail/Factories/getDamageInfo';
import { AffixInterface, subAffixInterface, RelicInterface, Element, RelicType } from '../../utils/starrail/SharedTypes';


class FormattedRelic implements RelicInterface{
    level: number;
    type: RelicType;
    setID: number;
    setName: string;
    rarity: number;
    mainAffix: AffixInterface;
    subAffix: subAffixInterface[];
    score:number|undefined;
    rate:string|undefined;
    constructor(level:number, type:RelicType, setID:number,  set:string, rarity:number,
         mainAffix:AffixInterface, subAffix:subAffixInterface[] = [],
          score:number|undefined = undefined, rate:string|undefined = undefined){
        this.level = level
        this.type = type
        this.setID = setID
        this.setName = set
        this.rarity = rarity
        this.mainAffix = mainAffix
        this.subAffix = subAffix
        this.score = score;
        this.rate = rate;
    }

    //This function is used for the frontend to reconstruct the prototype chain
    static fromObject(formattedRelic:FormattedRelic):FormattedRelic{
        const level = formattedRelic.level
        const type = formattedRelic.type
        const setID = formattedRelic.setID
        const setName = formattedRelic.setName
        const rarity = formattedRelic.rarity
        const mainAffix = formattedRelic.mainAffix
        const subAffix = formattedRelic.subAffix
        const score = formattedRelic.score
        const rate = formattedRelic.rate
        return new FormattedRelic(level, type, setID, setName, rarity, mainAffix, subAffix, score, rate)

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
