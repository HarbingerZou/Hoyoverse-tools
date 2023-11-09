import Router from "next/router";
export default async function handleSubmit({evt,path,redirect,additionalInfo,preCheck}){
    //console.log("yes");
    evt.preventDefault();
    
    const formData = new FormData(evt.target);
    
    let jsonObject = {};
    
    if(additionalInfo){
      for(let [key, value] of Object.entries(additionalInfo)){
        jsonObject[key] = value;
      }  
    }


    for (const [key, value]  of formData.entries()) {
        jsonObject[key] = value;
    }

    if(preCheck){
      const result = preCheck(jsonObject);
      if(result!==true){
        return result;
      }
    }

    const response = await fetch(`/api/${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonObject),
      });
      
      const data = await response.json();
      //if no data, or data is false
      if(!data){
        return {message:"submission failure"}
      }

      if(redirect){
        Router.push("/");
      }
      
    return true
}