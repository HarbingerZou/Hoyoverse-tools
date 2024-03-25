import FilterButton from "./filterButton"
import {HsrInfoInterface} from "../utils/starrail/SharedTypes";
import { processState } from "../utils/starrail/stateRelatedShareTyps";

interface AccountTabProps {
    selectedInfo: HsrInfoInterface | null;
    setSelectedInfo: React.Dispatch<HsrInfoInterface>
    infos: HsrInfoInterface[];
    deleteProps?:{
        loadingState: processState; 
        setLoadingState: React.Dispatch<React.SetStateAction<processState>>;
        update:()=>Promise<void>
    }
  }

export default function({selectedInfo, setSelectedInfo, infos, deleteProps}:AccountTabProps){
    //console.log(infos)
    
    function UIDtab({accountInfo}:{accountInfo:HsrInfoInterface}){
        if(!deleteProps){
            return(
                <FilterButton
                    state={selectedInfo}
                    value={accountInfo}
                    setState={() => setSelectedInfo(accountInfo)}
                    >
                    <button className="px-2 rounded-lg text-xl">UID: {accountInfo.uid}</button>
                </FilterButton>
            )
        }else{
            const {loadingState, setLoadingState, update} = deleteProps;
            return(
                        
                    <FilterButton
                        state={selectedInfo}
                        value={accountInfo}
                        setState={() => setSelectedInfo(accountInfo)}
                        >
                        <div className="flex flex-row items-center rounded-lg">
                            <button className="px-2 text-xl">UID: {accountInfo.uid}</button>
                    
                            <button onClick={async ()=>{
                                    if(loadingState === "loading"){
                                        return
                                    }
                                    setLoadingState("loading")
                                    await deleteHSRInfo(accountInfo)
                                    await update();
                                    setLoadingState("finished")
                                }
                            }> 
                                <svg className="fill-current w-6 border rounded-full border-secondary " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/>
                                </svg>
                            </button>
                        </div>
                    </FilterButton>
            )
        }
    }
    
    return(
        <div className="flex flex-row border-b border-secondary">
            {infos.map(accountInfo =>(
                <UIDtab accountInfo={accountInfo}/>
            ))}
        </div>
    )
    
    async function deleteHSRInfo(account:HsrInfoInterface){
        const response = await fetch(`/api/userInfo`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({hsrInfo:account}),
        });
        console.log(response)
    }
}   
