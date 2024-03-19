//This file define the common protocol between frontend and backend
type Element = "elec" | "imaginary" | "wind"|"fire"| "ice" | "quantum" | "physical"
type Path =  "destruction" | "hunt" | "erudition" | "harmony" | "nihility" | "perservation" | "abundance"
type RelicType = "HEAD" | "HAND" | "BODY" |"FOOT" | "NECK" |"OBJECT"
type Stat = "ATK"| "DEF" | "HP" | "ATK%"| "DEF%" | "HP%" |
     "Speed" | "CRIT Rate" | "CRIT DMG" | "Effect Hit Rate" | "Effect RES" | "Break Effect" | "Energy Regen Rate"| "Outgoing Healing" |
     "Fire DMG"| "Ice DMG"| "Physical DMG"| "Wind DMG"| "Quantum DMG"| "Imaginary DMG"| "Lightning DMG"
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

export type { Element, Path, Stat, RelicType, MultipliersInterface};