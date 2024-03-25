import getRelicScore from "../../utils/starrail/getRelicScore"
import getWeights from '../../utils/starrail/getWeight';
import {getDamageInfo} from '../../utils/starrail/Factories/getDamageInfo';

import { Stats } from './JSONStructure';
import { Factors } from './JSONStructure';

import { UserInfo } from './JSONStructureOwn';
import parser from "../../utils/starrail/parseAPIInfo";

export default async function handler(req:any, res:any) {
    const UID = req.query.uid
    const userInfoPlain:UserInfo|null = await parser(UID)
    //console.log(userInfoPlain)
    if(userInfoPlain == null){
        return res.status(500).json({Error:"Temporary error fetching user infos"})
    }else{
        const userInfo = await scorer(userInfoPlain)
        return res.status(200).json(userInfo)
    }
}

async function scorer(userInfo:UserInfo) {
    for(const avatar of userInfo.avatars){
        let totalScore = 0
        for(const relic of avatar.relics){
            const {score,rate} = await getRelicScore({relic:relic, name:avatar.name});
            relic.score = score;
            relic.rate = rate;
            totalScore+= score
        }
        const weights:Factors|undefined = await getWeights(avatar.name)
        avatar.info = getDamageInfo({stats:avatar.combatValues, rawCharacter: avatar, rawWeapon:avatar.weapon, relicList:avatar.relics})
        avatar.totalScore = Math.floor(totalScore*10)/10

        avatar.weights = weights;
        for(const stat in avatar.combatValues){
            const key = stat as keyof Stats
            let value:number = avatar.combatValues[key]
            value = value < 5? Math.floor(value*1000)/10 : Math.floor(value)
            avatar.combatValues[key] = value
        } 
    }
    return userInfo
}