import relicConfig from '../../models/starRailConfig/relicConfigModel';
import affixConfig from '../../models/starRailConfig/affixConfigModel';
import avatarConfig from '../../models/starRailConfig/avatarConfigModel'
import setConfig from '../../models/starRailConfig/setConfigModel';
//import { parseSubAffix,parseMainAffix } from '../../utils/parseAffix';
import getRelicScore from "../../utils/starrail/getRelicScore"
import getWeights from '../../utils/starrail/getWeight';
import factors from '../../utils/starrail/scoreFactor';
import { Element, RelicType } from '../../utils/starrail/Factories/CommonInterfaces';

import {getDamageInfo, CharacterInfo} from '../../utils/starrail/Factories/getDamageInfo';

import { Stats } from '../../utils/starrail/Factories/CommonInterfaces';
import { rawCharacter } from '../../utils/starrail/Factories/CharacterFacory';
import { rawWeapon } from '../../utils/starrail/Factories/WeaponFactory';
import { parseType } from '../../utils/renameMethod';

let cachedRelicConfig:RelicConfig|undefined = undefined;
let cachedAffixConfig:AffixConfig|undefined = undefined;
let cachedAvatarConfig:AvatarConfig[]|undefined = undefined;
let cachedSetConfig:SetConfig|undefined = undefined;


interface AvatarConfig{
    id:number,
    name:string,
    element:Element;
}

//represent the AffixConfig Object in database
interface AffixConfig{
    [key:string]:string
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
interface Affix{
    type:string,
    value:number,
    valueString:string
}

interface Relic{
    id:number;
    level:number;
    mainAffix:any;
    subAffixList:any[];
}

class FormattedRelic{
    level:number;
    type:string;
    setID:number
    set:string;
    rarity:number;
    score:number|undefined;
    rate:string|undefined;
    mainAffix:Affix;
    subAffix:Affix[];
    constructor(level:number, type:string, setID:number,  set:string, rarity:number, mainAffix:Affix){
        this.level = level;
        this.type = type;
        this.set = set;
        this.setID = setID;
        this.rarity = rarity;
        this.score = undefined;
        this.rate = undefined;
        this.mainAffix = mainAffix;
        this.subAffix = [];
    }
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

interface UserInfo{
    uid:number,
    name:string,
    level:number,
    avatars:CharacterWithStats[],
    factors:Factors
}

function parseMainAffix(affix:RawAffix,affix_config:any):Affix{
    const type:string = affix_config[affix.type.toString()];
    let value:number = affix.value;
    let valueString:string;
    if(value < 1){
        valueString = (Math.floor(value*1000)/10).toString()+"%";
    }else{
        if(type === "Speed"){
            valueString = (Math.floor(value*10)/10).toString();
        }else{
            valueString = Math.floor(value).toString();
        }
    }
    return {type,value,valueString}
}

function parseSubAffix(affix:RawSubAffix, affix_config:any):Affix{
    //console.log(affix)
    const type:string = affix_config[affix.info.type.toString()];
    let value:number = affix.info.value;
    let valueString:string;
    if(value < 1){
        valueString = (Math.floor(value*1000)/10).toString()+"%";
    }else{
        if(type === "Speed"){
            valueString = (Math.floor(value*10)/10).toString();
        }else{
            valueString = Math.floor(value).toString();
        }
    }
    return {type,value,valueString}

}

function parseRelic(relic:Relic,relic_config:RelicConfig,affix_config:AffixConfig,set_config:SetConfig):FormattedRelic{
    const level:number = relic.level;
    const type:string = parseType(relic_config[relic.id].Type); 
    const setId:number = relic_config[relic.id].SetID;

    //warning 
    const set:string = set_config[setId.toString()];
    const rarityString:string = relic_config[relic.id].Rarity.slice(-1);
    const rarity:number = parseInt(rarityString)

    const mainAffix:Affix = parseMainAffix(relic.mainAffix, affix_config)
    
    const formatted_relic:FormattedRelic = new FormattedRelic(level, type, setId, set, rarity, mainAffix)

    for(const subAffix of relic.subAffixList){
        const formatted_subAffix = parseSubAffix(subAffix, affix_config);
        formatted_relic.subAffix.push(formatted_subAffix);
    }

    return formatted_relic;
}



class CharacterWithStats implements rawCharacter{
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
    weapon:rawWeapon
    relics:any[]
    weights:Factors|undefined
    totalScore:number
    info:CharacterInfo|undefined

    constructor (rawCharacter:rawCharacter, name:string, element:Element, combatValues:Stats, weapon:rawWeapon){
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

interface rawSkill{
    id:number,
    level:number
}
export default async function handler(req:any, res:any) {
    const UID = req.query.uid
    const response = await fetch(`https://api.yshelper.com/ys/getHSRPlayerInfo.php?uid=${UID}`)
    const data = await response.json();

    //console.log(UID, data.retcode);

    if(data.retcode !== 0){
        return res.status(200).json({});
    }
    
    if (!cachedRelicConfig) {
        const rawRelicConfig = await relicConfig.find();
        cachedRelicConfig = JSON.parse(JSON.stringify(rawRelicConfig[0]));
    }

    if (!cachedAffixConfig) {
        const rawAffixConfig = await affixConfig.find();
        cachedAffixConfig = JSON.parse(JSON.stringify(rawAffixConfig[0]));
    }

    if (!cachedAvatarConfig) {
        const rawAvatarConfig = await avatarConfig.find();
        cachedAvatarConfig = JSON.parse(JSON.stringify(rawAvatarConfig));
    }
    if(!cachedSetConfig){
        const rawSetConfig = await setConfig.find();
        cachedSetConfig = JSON.parse(JSON.stringify(rawSetConfig[0]));
    }

    //const raw_relic_score = await Character_to_relic.find();
    //const relic_score = JSON.parse(JSON.stringify(raw_relic_score[0]));

    const userInfo: UserInfo= {
        uid: UID,
        name: data.nickname,
        level: data.level,
        avatars: [],
        factors:  factors
    };

    for(const avatar of [data.assistAvatar,...data.showAvatarList]){ 
        if(!cachedAvatarConfig){
            return;
        }

        //raw data
        const tempAvatarConfig:AvatarConfig|undefined = cachedAvatarConfig.find(instance => instance.id === avatar.avatarId)
        if(tempAvatarConfig === undefined){
            //The config of this character is not added;
            continue;
        }
        const skillList:rawSkill[] = avatar.skillList;

        const rawAvatar:rawCharacter = {
            id: avatar.avatarId,
            level: avatar.level,
            basic_level: skillList[0].level,
            skill_level: skillList[1].level,
            ultimate_level: skillList[2].level,
            talent_level:skillList[3].level,
            
            trace1: skillList.find(skill => skill.id%1000 === 101) !== undefined,
            trace2: skillList.find(skill => skill.id%1000 === 102) !== undefined,
            trace3: skillList.find(skill => skill.id%1000 === 103) !== undefined,
        }

        const formattedAvatar:CharacterWithStats = 
            new CharacterWithStats(rawAvatar, tempAvatarConfig.name, tempAvatarConfig.element, avatar.combatValues, avatar.weapon)
 
        for(const relic of avatar.relicList){
            //console.log(relic);
            if(cachedRelicConfig == undefined || cachedAffixConfig === undefined || cachedSetConfig === undefined){
                continue;
            }
            const formatted_relic:FormattedRelic = parseRelic(relic, cachedRelicConfig, cachedAffixConfig, cachedSetConfig);
            //console.log(formatted_relic);

            const {score,rate} = await getRelicScore({relic:formatted_relic, name:formattedAvatar.name});
            formatted_relic.score = score;
            formatted_relic.rate = rate;
            //console.log(formattedAvatar);
            formattedAvatar.relics.push(formatted_relic);
            formattedAvatar.totalScore += score
        }


        formattedAvatar.totalScore = Math.floor(formattedAvatar.totalScore*10)/10
        

        ///Damages
        formattedAvatar.info = getDamageInfo({stats:avatar.combatValues, rawCharacter: rawAvatar, rawWeapon:formattedAvatar.weapon, rawRelicList:formattedAvatar.relics})
        
        //format the combat value to make crit damage and rate percentage
        for(const stat in formattedAvatar.combatValues){
            const key = stat as keyof Stats
            let value:number = formattedAvatar.combatValues[key]
            value = value < 5? Math.floor(value*1000)/10 : Math.floor(value)
            formattedAvatar.combatValues[key] = value
        } 

        
        const weights:Factors|undefined = await getWeights(formattedAvatar.name)
        formattedAvatar.weights = weights;
        userInfo.avatars.push(formattedAvatar);
    }
    
    //console.log(userInfo)

    return res.status(200).json(userInfo)
}
