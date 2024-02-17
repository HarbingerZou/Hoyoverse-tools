//This file define the common protocol between frontend and backend
type Element = "elec" | "imaginary" | "wind"|"fire"| "ice" | "quantum" | "physical"
type Path =  "destruction" | "hunt" | "erudition" | "harmony" | "nihility" | "perservation" | "abundance"
type RelicType = "HEAD" | "HAND" | "BODY" |"FOOT" | "NECK" |"OBJECT"

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

export type { Element, Path, RelicType, MultipliersInterface};