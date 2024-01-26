import relicConfig from '../../models/starRailConfig/relicConfigModel';
import affixConfig from '../../models/starRailConfig/affixConfigModel';
import avatarConfig from '../../models/starRailConfig/avatarConfigModel'
import setConfig from '../../models/starRailConfig/setConfigModel';
//import { parseSubAffix,parseMainAffix } from '../../utils/parseAffix';
import getRelicScore from "../../utils/starrail/getRelicScore"
import getWeights from '../../utils/starrail/getWeight';
import factors from '../../utils/starrail/scoreFactor';

import {getDamageInfo} from '../../utils/starrail/Factories/getDamageInfo';

import { Stats } from './JSONStructure';
import { RawCharacter } from './JSONStructure';
import { AvatarConfig, RelicConfig, SetConfig, AffixConfig, RawAffix, RawRelic, RawSkill, Factors, RawSubAffix } from './JSONStructure';

import { parseType } from '../../utils/renameMethod';
import { ForMattedAffix, FormattedRelic, UserInfo, CharacterWithStats } from './JSONStructureOwn';

let cachedRelicConfig:RelicConfig|undefined = undefined;
let cachedAffixConfig:AffixConfig|undefined = undefined;
let cachedAvatarConfig:AvatarConfig[]|undefined = undefined;
let cachedSetConfig:SetConfig|undefined = undefined;


function parseMainAffix(affix:RawAffix,affix_config:any):ForMattedAffix{
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

function parseSubAffix(affix:RawSubAffix, affix_config:any):ForMattedAffix{
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

function parseRelic(relic:RawRelic,relic_config:RelicConfig,affix_config:AffixConfig,set_config:SetConfig):FormattedRelic{
    const level:number = relic.level;
    const type:string = parseType(relic_config[relic.id].Type); 
    const setId:number = relic_config[relic.id].SetID;

    //warning 
    const set:string = set_config[setId.toString()];
    const rarityString:string = relic_config[relic.id].Rarity.slice(-1);
    const rarity:number = parseInt(rarityString)

    const mainAffix:ForMattedAffix = parseMainAffix(relic.mainAffix, affix_config)
    
    const formatted_relic:FormattedRelic = new FormattedRelic(level, type, setId, set, rarity, mainAffix)

    for(const subAffix of relic.subAffixList){
        const formatted_subAffix = parseSubAffix(subAffix, affix_config);
        formatted_relic.subAffix.push(formatted_subAffix);
    }

    return formatted_relic;
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
        const skillList:RawSkill[] = avatar.skillList;

        const rawAvatar:RawCharacter = {
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
            if(cachedRelicConfig == undefined || cachedAffixConfig === undefined || cachedSetConfig === undefined){
                continue;
            }
            const formatted_relic:FormattedRelic = parseRelic(relic, cachedRelicConfig, cachedAffixConfig, cachedSetConfig);
            //console.log(formatted_relic)

            const {score,rate} = await getRelicScore({relic:formatted_relic, name:formattedAvatar.name});
            formatted_relic.score = score;
            formatted_relic.rate = rate;
            //console.log(formattedAvatar);
            formattedAvatar.relics.push(formatted_relic);
            formattedAvatar.totalScore += score
        }


        formattedAvatar.totalScore = Math.floor(formattedAvatar.totalScore*10)/10
        

        ///Damages
        formattedAvatar.info = getDamageInfo({stats:avatar.combatValues, rawCharacter: rawAvatar, rawWeapon:formattedAvatar.weapon, relicList:formattedAvatar.relics})
        
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
