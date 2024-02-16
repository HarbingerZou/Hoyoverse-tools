import { useState } from "react";
type AsyncFunction = (...args: any[]) => Promise<any>;
//return false if the async function is not executed, return the result of async function other wise.
export default function useRacingCheckWrapper(asyncFunction:AsyncFunction){
    const [inProcessing, setInProcessing] = useState(false);
    const wrappedFunction = async (...args: any[]) => {
        if (inProcessing) {
          console.log("In processing");
          return false;
        } else {
          setInProcessing(true);
          let result;
          try {
            result = await asyncFunction(...args);
          } catch (err) {
            console.error("Error in wrapped async function:", err);
          } finally {
            // Ensures that the state update happens after the async operation
            // This needs to be done in a useEffect hook or a similar approach to avoid direct state updates in asynchronous operations
            setInProcessing(false);
          }
          return result;
        }
    };
    return wrappedFunction
}