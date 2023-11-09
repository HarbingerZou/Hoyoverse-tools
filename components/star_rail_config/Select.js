import ValueSelect from "../valueSelect"
function MultiplierCategorySelect({name, category}){
    const options = ["boostMultiplier", "defReduction", "resMultiplier", "vulnerabilityMultiplier"]
    return <ValueSelect value={category} optionValues={options} name={name}/>
}

function DamageTypeSelect({name,value}){
    const options= ["All", "Normal Attack", "Skill", "Ultimate", "followUp", "DOT"]
    return <ValueSelect value={value} optionValues={options} name={name}/>
}
export {MultiplierCategorySelect}

