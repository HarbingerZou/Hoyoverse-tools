import { parseType } from "../utils/renameMethod"
import { RelicBriefInterface } from "../utils/starrail/SharedTypes"
export default function({relic}:{relic:RelicBriefInterface}){
    //console.log(parseType(relic.type))
    return (
        <div className={`flex flex-col items-center bg-star-${relic.rarity} py-1`}>
            <img src={`/starrail/Relics Full/${relic.setName}/${parseType(relic.type)}.png`}
                alt={`/${relic.setName}/${relic.type}`} 
                className="w-5/6 border-t border-l border-r border-gray-500" />
            <p className="p-0 m-0 bg-secondary w-full text-center text-sm"> +{relic.level}</p>
        </div>
    )
}
