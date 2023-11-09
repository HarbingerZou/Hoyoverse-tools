export default function calculateDamage({stats, characterID, lightconeID, relicIDs, ornamentIDs}){
    const {level, attackFinal, defenseFinal, hpFinal, criticalChance, criticalDamage} = stats
    if(criticalChance>=5||criticalDamage>=50){
        criticalChance = criticalChance/100
        criticalDamage = criticalDamage/100
    }

    let critMultiplier = (1+Math.min(1,criticalChance)*criticalDamage)
    //skill, boost, def reduce, res, and vulnerability can be find in database for each character
    let skillMultiplier = 1
    let boostMultiplier = 1
    
    let defReduction = 0
    let enemyLevel = 80
    let defMultiplier = (level+20)/((enemyLevel+20)*(1-defReduction) + level + 20)
    let resMultiplier = 1
    let vulnerabilityMultiplier = 1
    let toughnessMultiplier = 0.9

    if(damageType === "ATK"){
        const expectDamage = attackFinal*skillMultiplier*critMultiplier*boostMultiplier*defMultiplier*resMultiplier*vulnerabilityMultiplier*toughnessMultiplier
        return {expectDamage}
    }
    return 
}