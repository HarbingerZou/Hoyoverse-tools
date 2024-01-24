import {Stats,SpecialEffects} from "./CommonInterfaces"
import {rawCharacter, Info, Character, getCharacter} from "./CharacterFacory"
import {rawWeapon, Weapon, getWeapon } from "./WeaponFactory";

interface InputParams {
    stats: Stats; 
    rawCharacter: rawCharacter;
    rawWeapon: rawWeapon; 
    rawRelicList: any[]; 
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

function getDamageInfo({stats, rawCharacter, rawWeapon, rawRelicList}:InputParams):CharacterInfo|undefined{
    stats = JSON.parse(JSON.stringify(stats));
    //console.log(rawCharacter)
    //console.log(rawWeapon)

    const weapon:Weapon|undefined = getWeapon(rawWeapon);
    const character:Character|undefined = getCharacter(rawCharacter);
    if(character === undefined){
        return undefined
    }
    if(weapon === undefined){
        return undefined
    }

    const globalEffectList:string[] = [];

    let boostMultiplier:number = 1;

    switch (character.element){
        case "elec":
            boostMultiplier += stats.elecAddHurt;
            break
        case "imaginary":
            boostMultiplier += stats.imaginaryAddHurt;
            break;
        case "wind":
            boostMultiplier += stats.windAddHurt;
            break;
        case "fire":
            boostMultiplier += stats.fireAddHurt;
            break;
        case "ice":
            boostMultiplier += stats.fireAddHurt;
            break
        case "quantum":
            boostMultiplier += stats.quantumAddHurt;
        case "physical":
            boostMultiplier += stats.physicalAddHurt
    }

    const effect:SpecialEffects = new SpecialEffects(boostMultiplier);
    console.log(effect);
    console.log(globalEffectList);
    weapon.addEffectGlobal(stats, globalEffectList, effect);
    console.log(effect);
    console.log(globalEffectList);
    character.addEffectGlobal(stats, globalEffectList, effect);
    console.log(effect);
    console.log(globalEffectList);

    const info1:Info|undefined = character.getInfo1(stats, effect, weapon);
    const info2:Info|undefined = character.getInfo2(stats, effect, weapon);
    const info3:Info|undefined = character.getInfo3(stats, effect, weapon);

    const outputInfo:CharacterInfo = new CharacterInfo(globalEffectList, info1, info2, info3);
    return outputInfo;
}

export {getDamageInfo, CharacterInfo}
