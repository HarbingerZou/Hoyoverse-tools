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
  setUID?:React.Dispatch<React.SetStateAction<number|undefined>>;
  toDos?: ((data: UserInfo) => Promise<void>|void)[]; 
}

export default function({loadingState, setLoadingState, toDos,plainData, setUID}:SearchBoxProps){
    const UIDInput = useRef<HTMLInputElement>(null);
    async function searchButtonClicked(evt: React.MouseEvent<HTMLButtonElement>){
        if(loadingState==="loading"){
            return;
        }
        if (!UIDInput.current || UIDInput.current.value === "") {
            return;
        }
        const UID:number = Number(UIDInput.current.value);

        //console.log("UID", UID)
        if(isNaN(UID)){
          return
        }

        if(setUID){
          setUID(UID)
        }

        try {
          setLoadingState("loading")

            const response = plainData? await fetch(`/api/HSRInfo?uid=${UID}`): await fetch(`/api/scorer?uid=${UID}`);
            const data = await response.json();
            const {userInfo, Error} = data
            if(Error){
              setLoadingState("failed");
              return
            }
            
            if (toDos) {
              for (const toDo of toDos) {
                await toDo(userInfo);
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
