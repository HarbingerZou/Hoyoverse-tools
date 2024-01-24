import {Stats,addEffect, SpecialEffects, Multipliers, Path} from "./CommonInterfaces"
interface rawWeapon{
    id:number;
    level:number;
    promotion:number;
    rankLevel: number;
}

interface Weapon extends addEffect{
    name:string;
    path:Path;
    level:number;
    promotion:number;
    rankLevel: number;
}


class brighter_than_the_sun implements Weapon{
    name: string;
    path: Path;
    level: number;
    promotion: number;
    rankLevel: number;
    damageBoost: number;
    constructor(level: number, promotion: number, rankLevel: number) {
        this.name = "Brighter Than the Sun";
        this.path = "destruction";
        this.level = level;
        this.promotion = promotion;
        this.rankLevel = rankLevel;
        this.damageBoost = 0;
    }

    addEffectGlobal(stats: Stats, effectList:string[], effect:SpecialEffects): void {
        stats.attackFinal += 0.36*stats.attackBase;
        effectList.push("Defiant Till Death: Increases the wearer's Attack by 36%");
    }
}


function getWeapon(weapon:rawWeapon):Weapon | undefined{
    if(weapon.id == 23015){
        return new brighter_than_the_sun(weapon.level, weapon.promotion, weapon.rankLevel);
    }else{
        return undefined;
    }
}

export { getWeapon };
export type { rawWeapon, Weapon };
