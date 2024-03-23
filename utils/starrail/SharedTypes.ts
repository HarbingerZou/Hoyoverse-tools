//This file define the common protocol between frontend and backend
//These types should be shared between frontend and backend




type Element = "elec" | "imaginary" | "wind"|"fire"| "ice" | "quantum" | "physical"
type Path =  "destruction" | "hunt" | "erudition" | "harmony" | "nihility" | "perservation" | "abundance"
type RelicType = "HEAD" | "HAND" | "BODY" |"FOOT" | "NECK" |"OBJECT"

type MainStatType = "ATK"| "HP" | "ATK%"| "DEF%" | "HP%" |
     "Speed" | "CRIT Rate" | "CRIT DMG" | "Effect HIT Rate" | "Break Effect" | "Energy Regen Rate"| "Outgoing Healing" |
     "Fire DMG"| "Ice DMG"| "Physical DMG"| "Wind DMG"| "Quantum DMG"| "Imaginary DMG"| "Lightning DMG"

type SubStatType = "ATK"| "DEF" | "HP" | "ATK%"| "DEF%" | "HP%" |
"Speed" | "CRIT Rate" | "CRIT DMG" | "Effect HIT Rate" | "Effect RES" | "Break Effect"

interface AffixInterface{
    type:MainStatType,
    value:number,
}

interface subAffixInterface{
    type:SubStatType,
    count:number
    value:number,
}
    
interface RelicBriefInterface{
    level:number;
    type:RelicType;
    setName:string;
    rarity:number;
    mainAffix:AffixInterface;
    subAffix:subAffixInterface[];
}

interface RelicInterface extends RelicBriefInterface{
    level:number;
    type:RelicType;
    setID:number
    setName:string;
    rarity:number;
    mainAffix:AffixInterface;
    subAffix:subAffixInterface[];
}

interface WeaponInterface {
    name:string;
    path:Path;
    level:number;
    promotion:number;
    rankLevel: number;
}

interface MultipliersInterface{
    attack:number;
    skillMultiplier:number;
    critMultiplier:number
    boostMultiplier:number
    vulnerabilityMultiplier:number
    defMultiplier:number
    resMultiplier:number
    toughnessMultiplier:number
    targetCount:number
}

interface CharacterBriefInfo{
    name: string;
    path: Path;
    element: Element;
    level:number;
}

interface HsrInfoInterface {
    uid: number;
    name: string;
    level: string;
    relics: RelicInterface[];
  }
  
  interface UserInterface {
    username: string;
    password: string;
    email: string;
    hsrInfo: HsrInfoInterface[];
    signUpTime: Date;
  }

export type { Element, Path, MainStatType, SubStatType, RelicType,
    MultipliersInterface, RelicInterface, AffixInterface, subAffixInterface, WeaponInterface, CharacterBriefInfo,
    RelicBriefInterface, HsrInfoInterface, UserInterface};