import { FormattedRelic } from "../pages/api/JSONStructureOwn"
import { Relic } from "../utils/starrail/Factories/RelicFactory"
import { parseStat, parseType, parseValue } from "../utils/renameMethod"
export default function({relic}:{relic:Relic}){
    //console.log(relic instanceof FormattedRelic);
    return(
        <div className="flex flex-col w-80 m-4">
            <p className={`border-b-2 text-star-${relic.rarity} border-star-${relic.rarity}`}>{relic.setName}</p>
            <div className={`flex flex-row items-end justify-between bg-star-${relic.rarity} my-2 py-1 px-4`}>
                <div className='flex flex-col'>
                    {relic instanceof FormattedRelic?
                        <div className="flex flex-col text-sm">
                            <p>Score: {relic.score}</p>
                            <p>Rate: {relic.rate}</p>
                        </div>:
                        <p>{relic.type}</p>
                    }
                    <p>+ {relic.level}</p>
                </div>
                <img className = "w-20" src={`/starrail/Relics Full/${relic.setName}/${parseType(relic.type)}.png`} alt={`/${relic.setName}/${relic.type}`} />
            </div>

            <div className="flex flex-col">
                <div className="flex flex-row justify-between text-slate-50">
                    <div className="flex flex-row">
                        <img className="w-5 aspect-auto" src={`/starrail/Stats Icon/${parseStat(relic.mainAffix.type)}.webp`}/>
                        <p className="text-star-5 text-lg">{relic.mainAffix.type}</p>
                    </div>
                    <p className="text-star-5 text-lg">{parseValue(relic.mainAffix.value, relic.mainAffix.type)}</p>
                </div>
                {relic.subAffix.map(affix=>(
                    <div key={affix.type} className="flex flex-row justify-between">
                        <div className="flex flex-row">
                            <img className="w-5" src={`/starrail/Stats Icon/${parseStat(affix.type)}.webp`}/>
                            <p>{affix.type}</p>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <p>{parseValue(affix.value, affix.type)}</p>
                            <p className="inline-flex justify-center items-center w-5 h-5 border rounded-full">
                                {affix.count}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}