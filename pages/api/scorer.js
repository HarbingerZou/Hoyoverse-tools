import relicConfig from '../../models/starRailConfig/relicConfigModel';
import affixConfig from '../../models/starRailConfig/affixConfigModel';
import avatarConfig from '../../models/starRailConfig/avatarConfigModel'
import setConfig from '../../models/starRailConfig/setConfigModel';
//import { parseSubAffix,parseMainAffix } from '../../utils/parseAffix';
import getRelicScore from "../../utils/starrail/getRelicScore"
import getWeights from '../../utils/starrail/getWeight';
import factors from '../../utils/starrail/scoreFactor';

let cachedRelicConfig = null;
let cachedAffixConfig = null;
let cachedAvatarConfig = null;
let cachedSetConfig = null;

function parseType(type){
    switch (type) {
        case "HEAD":
            return "Head";
        case "HAND":
            return "Hand";
        case "BODY":
            return "Body";
        case "FOOT":
            return "Foot";
        case "NECK":
            return "Planar Sphere";
        case "OBJECT":
            return "Link Rope";
        default:
            return "Undefined";
    }
    
}

function elementMapper(element){
    switch (element) {
        case "elec":
            return "Lightning";
        case "imaginary":
            return "Imaginary";
        case "wind":
            return "Wind";
        case "fire":
            return "Fire";
        case "ice":
            return "Ice";
        case "quantum":
            return "Quantum";
        case "physical":
            return "Physical"
        default:
            return "Undefined";
    }
}

function parseMainAffix(affix,affix_config){
    const type = affix_config[affix.type.toString()];
    let value = affix.value;
    let valueString =  0;
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


function parseSubAffix(affix, affix_config){
    //console.log(affix)
    const type = affix_config[affix.info.type.toString()];
    let value = affix.info.value;
    let valueString =  0;
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


function parseRelic(relic,relic_config,affix_config,set_config){
    const formatted_relic = {}
    formatted_relic.level = relic.level;
    formatted_relic.type = parseType(relic_config[relic.id].Type); 
    const setId = relic_config[relic.id].SetID;
    formatted_relic.set = set_config[setId];
    formatted_relic.rarity = relic_config[relic.id].Rarity.slice(-1);
    

    const mainAffix = parseMainAffix(relic.mainAffix, affix_config)
    formatted_relic.mainAffix = mainAffix;

    formatted_relic.subAffix = [];
    for(const subAffix of relic.subAffixList){
        const formatted_subAffix = parseSubAffix(subAffix, affix_config);
        formatted_relic.subAffix.push(formatted_subAffix);
    }

    return formatted_relic;
}




export default async function handler(req, res) {
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

    const userInfo = {
        uid:UID,
        name: data.nickname,
        level: data.level,
        avatars: []
    };

    for(const avatar of [data.assistAvatar,...data.showAvatarList]){ 
        const tempAvatarConfig = cachedAvatarConfig.find(instance => instance.id === avatar.avatarId)
        const formattedAvatar = {
            name: tempAvatarConfig.name,
            element: tempAvatarConfig.element,
            elementString: elementMapper(tempAvatarConfig.element),
            level: avatar.level,
            combateValues: avatar.combatValues,
            basic_level: avatar.skillList[0].level,
            skill_level: avatar.skillList[1].level,
            ultimate_level :avatar.skillList[2].level,
            relics: []
        }

        for(const stat in formattedAvatar.combateValues){
            let value = formattedAvatar.combateValues[stat]
            value = value < 5? Math.floor(value*1000)/10 : Math.floor(value)
            formattedAvatar.combateValues[stat] = value
        }    
        formattedAvatar.totalScore = 0
        for(const relic of avatar.relicList){
            //console.log(relic);
            const formatted_relic = parseRelic(relic, cachedRelicConfig, cachedAffixConfig, cachedSetConfig);
            //console.log(formatted_relic);

            const {score,rate} = await getRelicScore({relic:formatted_relic, name:formattedAvatar.name});
            formatted_relic.score = score;
            formatted_relic.rate = rate;
            //console.log(formattedAvatar);
            formattedAvatar.relics.push(formatted_relic);
            formattedAvatar.totalScore += score
        }

        const weights = await getWeights(formattedAvatar.name)
        formattedAvatar.weights = weights;
        formattedAvatar.totalScore = Math.floor(formattedAvatar.totalScore*10)/10
        userInfo.avatars.push(formattedAvatar);
    }
    
    userInfo.factors = factors
    return res.status(200).json(userInfo)
}
