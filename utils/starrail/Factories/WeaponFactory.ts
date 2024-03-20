import { addEffect, SpecialEffects, Multipliers, Path, Context, AllTeamEffect} from "./CommonInterfaces"
import { RawWeapon } from "../../../pages/api/JSONStructure";
import { Stats } from "../../../pages/api/JSONStructure";
interface Weapon extends addEffect{
    name:string;
    path:Path;
    level:number;
    promotion:number;
    rankLevel: number;
}
class Weapon implements Weapon{
    name:string;
    path:Path;
    level:number;
    promotion:number;
    rankLevel: number;
    constructor(name:string, path:Path, level: number, promotion: number, rankLevel: number) {
        this.name = name
        this.path = path
        this.level = level;
        this.promotion = promotion;
        this.rankLevel = rankLevel;
    }
    isEffective(context:Context):boolean {
        return context.currentCharacter.path === this.path;
    }
}

class brighter_than_the_sun extends Weapon{
    constructor(level: number, promotion: number, rankLevel: number) {
        const name = "Brighter Than the Sun";
        const path = "destruction";
        super(name,path,level,promotion,rankLevel)
    }
    addEffect(effect: AllTeamEffect, context: Context): void {
        if(this.isEffective(context)){
            const currentCharacter = context.currentCharacter
            const currentCharacterEffect = effect.characterEffect.get(currentCharacter)
            if(currentCharacterEffect === undefined){
                return
            }
            currentCharacterEffect.globalEffect.statsBoost.attack += 0.36*context.stats.attackBase
            currentCharacterEffect.globalEffect.notes.push("Defiant Till Death: Increases the wearer's Attack by 36%")
        }
    }
}


function getWeapon(weapon:RawWeapon|undefined):Weapon | undefined{
    if(weapon === undefined){
        return undefined
    }
    
    if(weapon.id == 23015){
        return new brighter_than_the_sun(weapon.level, weapon.promotion, weapon.rankLevel);
    }else{
        return undefined;
    }
}

export { getWeapon };
export type { Weapon };
