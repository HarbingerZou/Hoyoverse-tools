import {SpecialEffects} from "./CommonInterfaces"
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

function getDamageInfo({stats, rawCharacter, rawWeapon, relicList}:InputParams):CharacterInfo|undefined{
    stats = JSON.parse(JSON.stringify(stats));
    //console.log(rawCharacter)
    //console.log(rawWeapon)
    //console.log(relicList)

    const weapon:Weapon|undefined = getWeapon(rawWeapon);
    const character:Character|undefined = getCharacter(rawCharacter);
    const relicSets:RelicSet[] = getRelicSetList(relicList);
    if(character === undefined){
        return undefined
    }
    if(weapon === undefined){
        return undefined
    }

    const globalEffectList:string[] = [];


    const effect:SpecialEffects = new SpecialEffects();
    //console.log(effect);
    //console.log(globalEffectList);
    if(weapon.path === character.path){
        weapon.addEffectGlobal(stats, globalEffectList, effect);
    }
    //console.log(effect);
    //console.log(globalEffectList);
    character.addEffectGlobal(stats, globalEffectList, effect);
    //console.log(effect);
    //console.log(globalEffectList);

    for(const relicSet of relicSets){
        relicSet.addEffectGlobal(stats, globalEffectList, effect)
    }

    const info1:Info|undefined = character.getInfo1(stats, effect, weapon, relicSets);
    const info2:Info|undefined = character.getInfo2(stats, effect, weapon, relicSets);
    const info3:Info|undefined = character.getInfo3(stats, effect, weapon, relicSets);

    const outputInfo:CharacterInfo = new CharacterInfo(globalEffectList, info1, info2, info3);
    disPlayInfo(outputInfo);
    return outputInfo;
}

function disPlayInfo(characterInfo:CharacterInfo){
    console.log(characterInfo);
    for(const info of characterInfo.infos){
        console.log(info.notes)
        console.log(info.multipliers)
    }
}
export {getDamageInfo, CharacterInfo}
