import { useRef } from "react";
import { UserInterface } from "../utils/starrail/SharedTypes";
import UIDSearchBox from "./UIDSearchBox";
interface SearchBoxProps {
    state: "loading" | "finished" | "initial"; 
    setState: React.Dispatch<React.SetStateAction<"loading" | "finished" | "initial">>;
    setResult: React.Dispatch<React.SetStateAction<UserInterface|null>>;
    toDos?: ((data: UserInterface) => Promise<void>)[]; 
  }

export default function({state, setState, setResult, toDos}:SearchBoxProps){
    const UIDInput = useRef<HTMLInputElement>(null);
    async function searchButtonClicked(evt: React.MouseEvent<HTMLButtonElement>){
        if(state==="loading"){
            return;
        }
        if (!UIDInput.current || UIDInput.current.value === "") {
            return;
        }
        const UID = UIDInput.current.value;
        
        try {
            //get the new whole user data
            const response = await fetch(`/api/scorer?uid=${UID}`);
            const data = await response.json();
      
            
            setResult(data);
            
      
            if (toDos) {
              for (const toDo of toDos) {
                await toDo(data);
              }
            }
      
            setState("finished");
          } catch (error) {
            console.error("Failed to fetch user info:", error);

            setState("finished");
          }
    }
    return(
        <div>
          <UIDSearchBox UIDInput={UIDInput} searchButtonClicked={searchButtonClicked}/>
        </div>
    )
}
