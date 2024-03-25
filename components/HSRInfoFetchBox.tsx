import { useRef } from "react";
import UIDSearchBox from "./UIDSearchBoxUI";
import { UserInfo } from "../pages/api/JSONStructureOwn";
import { processState } from "../utils/starrail/stateRelatedShareTyps";
//get the HSR info with a corresponding UID
interface SearchBoxProps {
  loadingState: processState; 
  setLoadingState: React.Dispatch<React.SetStateAction<processState>>;
  //can accept async or sync functions
  plainData:boolean
  toDos?: ((data: UserInfo) => Promise<void>|void)[]; 
}

export default function({loadingState, setLoadingState, toDos,plainData}:SearchBoxProps){
    const UIDInput = useRef<HTMLInputElement>(null);
    async function searchButtonClicked(evt: React.MouseEvent<HTMLButtonElement>){
        if(loadingState==="loading"){
            return;
        }
        if (!UIDInput.current || UIDInput.current.value === "") {
            return;
        }
        const UID = UIDInput.current.value;
        
        try {
          setLoadingState("loading")

            const response = plainData? await fetch(`/api/HSRInfo?uid=${UID}`): await fetch(`/api/scorer?uid=${UID}`);
            const data = await response.json();
      
      
            if (toDos) {
              for (const toDo of toDos) {
                await toDo(data);
              }
            }
      
            setLoadingState("finished");
          } catch (error) {
            console.error("Failed to fetch user info:", error);

            setLoadingState("finished");
          }
    }
    return(
        <div>
          <UIDSearchBox UIDInput={UIDInput} searchButtonClicked={searchButtonClicked}/>
        </div>
    )
}
