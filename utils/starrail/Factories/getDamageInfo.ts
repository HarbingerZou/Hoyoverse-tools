import {SpecialEffects, Context, AllTeamEffect, SingleCharacterEffects} from "./CommonInterfaces"
import { Stats } from "../../../pages/api/JSONStructure";
import { Info, Character, getCharacter} from "./CharacterFacory"
import { Weapon, getWeapon } from "./WeaponFactory";
import { Relic, RelicSet, getRelicSetList } from "./RelicFactory";

import { RawCharacter,RawWeapon } from "../../../pages/api/JSONStructure";

interface InputParams {
    stats: Stats; 
    rawCharacter: RawCharacter;
    rawWeapon: RawWeapon|undefined; 
    relicList: Relic[]; 
}

class CharacterInfo{
    globalEffectList:string[]
    infos:Info[]
    constructor(globalEffectList:string[], info1:Info|undefined, info2:Info|undefined, info3:Info|undefined){
        this.globalEffectList = globalEffectList;
        this.infos = [];
        if(info1){
            this.infos.push(info1);
        }
        if(info2){
            this.infos.push(info2);
        }
        if(info3){
            this.infos.push(info3);
        }

    }
}

//This is deprecated for version 2.1.
//Unable to handle New planar ornaments well
//Cumbersome perform ornament effect to read teammates path in potential future scnarios.
//If relic/ornamnet effect is local, trigger chain would be character.local -> relic.local -> charcter.info && teammates.info
//New solution, list of object for global and local effects for whole team,
//where character, relic, weapon modify the comprehensive effect object
function getDamageInfo({stats, rawCharacter, rawWeapon, relicList}:InputParams):CharacterInfo|undefined{
    stats = JSON.parse(JSON.stringify(stats));
    //console.log(rawCharacter)
    //console.log(rawWeapon)
    //console.log(relicList)

    const weapon:Weapon|undefined = getWeapon(rawWeapon);
    const character:Character<any[], any[], any[], any[]>|undefined = getCharacter(rawCharacter);
    const relicSets:RelicSet[] = getRelicSetList(relicList);
    if(character === undefined){
        return undefined
    }
    if(weapon === undefined){
        return undefined
    }


    const context = new Context(stats,character,[])

    const currentCharacterEffect = new SingleCharacterEffects()
    const effect:AllTeamEffect = new AllTeamEffect();

    effect.characterEffect.set(character,currentCharacterEffect)
    //console.log(effect.characterEffect.values().next())
    weapon.addEffect(effect,context);
    //console.log(effect.characterEffect.values().next())
    character.addEffect(effect, context);
    //console.log(effect.characterEffect.values().next())

    for(const relicSet of relicSets){
        relicSet.addEffect(effect, context)
    }
    const globalEffectList = getGlobalNotes(effect, context)

    const info1:Info|undefined = character.getInfo1(effect, context);
    const info2:Info|undefined = character.getInfo2(effect, context);
    const info3:Info|undefined = character.getInfo3(effect, context);

    const outputInfo:CharacterInfo = new CharacterInfo(globalEffectList, info1, info2, info3);
    //disPlayInfo(outputInfo);
    return outputInfo;
}


function getGlobalNotes(effect:AllTeamEffect, context:Context):string[]{
    const currentCharacter = context.currentCharacter
    const currentCharacterEffect = effect.characterEffect.get(currentCharacter)
    if(currentCharacterEffect===undefined){
        return []
    }

    return currentCharacterEffect.globalEffect.notes
}

function disPlayInfo(characterInfo:CharacterInfo){
    console.log(characterInfo);
    for(const info of characterInfo.infos){
        console.log(info.notes)
        console.log(info.multipliers)
    }
}
export {getDamageInfo, CharacterInfo}
