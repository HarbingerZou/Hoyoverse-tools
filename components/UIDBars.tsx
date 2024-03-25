import FilterButton from "./filterButton"
import {HsrInfoInterface} from "../utils/starrail/SharedTypes";
interface AccountTabProps {
    selectedInfo: HsrInfoInterface | null;
    setSelectedInfo: React.Dispatch<HsrInfoInterface>
    infos: HsrInfoInterface[];
  }

export default function({selectedInfo, setSelectedInfo, infos}:AccountTabProps){
    //console.log(infos)
    return(
        <div className="flex flex-row border-b border-secondary">
            {infos.map(accountInfo =>(
                <FilterButton
                    state={selectedInfo}
                    value={accountInfo}
                    setState={() => setSelectedInfo(accountInfo)}
                    >
                    <button className="px-2 rounded-lg text-xl">UID: {accountInfo.uid}</button>
                </FilterButton>
            ))}
        </div>
    )
}