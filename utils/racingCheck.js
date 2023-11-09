import { useState } from "react";

//return false if the async function is not executed, return the result of async function other wise.
export default function useRacingCheckWrapper(asycFunction){
    const [inProcessing, setInProcessing] = useState(false);
    const wrappedFunction = async (...args) => {
        if(inProcessing){
            return (arg) => {
                console.log("In processing")
                return false
            }
        }else{
            setInProcessing(true);
            let result;
            try{
                result = await asycFunction(...args)
            }catch(err){
                console.error("Error in wrapped async function:", err);
            }finally{
                setInProcessing(false);
            }
            return result
        }
    }
    return wrappedFunction
}