import { RelicInterface } from "../utils/starrail/SharedTypes"
export default function({relic}:{relic:RelicInterface}){
    //console.log(relic.rarity)
    return (
        <div className="flex flex-col items-center">
            <img src={`/Relics_full/${relic.setName}/${relic.type}.png`} alt={`/${relic.setName}/${relic.type}`} />
            <p>+{relic.level}</p>
        </div>
    )
}
