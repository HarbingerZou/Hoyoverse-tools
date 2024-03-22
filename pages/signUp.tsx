import { useRef } from "react";
import { useState } from "react";
import Router from "next/router";
import { signIn } from "next-auth/react"
import useRacingCheckWrapper from "../utils/racingCheck";
import CountDownButtonWrapper from "../components/countDownButtonWrapper";
let code:string|undefined = undefined;
let codeDestinationEmail:string|undefined = undefined;
export default function(){
    const email = useRef<HTMLInputElement>(null);
    const verification_code = useRef<HTMLInputElement>(null);
    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<string | undefined>(undefined);;


    async function verify({evt}:{evt:Event}):Promise<boolean>{
        setMessage(undefined);
        
        evt.preventDefault();
        if(email.current=== null){
            setMessage("React Dom Error")
            return false;
        }
        if(email.current.value === ""){
            setMessage("Please enter your email")
            return false;
        }
    
        const response = await fetch(`/api/sendVerificationCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(email.current.value),
        });
    
    
        const {error, message} = await response.json();
        if(error){
            setMessage(error)
            return true
        }else{
            code = message
            codeDestinationEmail = email.current.value
            return true
        }
    }



//return true if fetched server

async function submitPressed({evt}:any){
    //waiting for sever response;
    evt.preventDefault();
    setMessage(undefined);
    if(username.current === null || password.current===null||verification_code.current===null||email.current === null){
        setMessage("React Dom Error")
        return false
    }

    if(username.current.value.length < 3){
        setMessage("Username Too Short")
        return false;
    }

    if(username.current.value.length > 20){
        setMessage("Username Too Long")
        return false;
    }

    if(password.current.value.length < 8){
        setMessage("Password Too Short");
        return false;
    }

    if(verification_code.current.value !== code){
        setMessage("Incorrect Verification Code")
        return false
    }

    if(email.current.value !== codeDestinationEmail){
        setMessage("The email address does not match the intended recipient of the code")
        return false
    }
    let input = {
        username:username.current.value,
        email:email.current.value,
        password:password.current.value
    };

    const response = await fetch(`/api/signUp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input),
    });
    
    const {message, success} = await response.json();

    if(success === true){
        const result = await signIn("credentials", input);
        Router.push("/");
    }else{
        setMessage(message);
    }
    return true;
}


    
    const protectedVerify = useRacingCheckWrapper(verify);
    return(
        <div className="body" onSubmit={(evt) => submitPressed({evt, verification_code, username, password, setMessage})}>
            <form className="flex flex-col items-center w-full border border-secondary p-4 gap-6">
                    <img src="/Honkai_Star_Rail.webp" alt = "Honkai:Star Rail" className="w-32"/>
                    <h2>Sign Up</h2>
                    <input type="email" name="email" placeholder = "email" required ref={email} className="input input-bordered w-full grow"/>
                    <input type="text" name="username"  placeholder = "username" required ref={username} className="input input-bordered w-full grow"/>
                    <input type="password" name="password"  placeholder = "password at least 8 digits" required ref={password} className="input input-bordered w-full grow"/>
                    <div className="flex flex-row w-full gap-2">
                        <input type="text" name="code"  placeholder="verification code" required ref={verification_code} className="input input-bordered grow"/>

                        <CountDownButtonWrapper countDownSecond={60}>
                            <button onClick={(evt) => protectedVerify({evt, email,setMessage})} className="btn border border-secondary">Get Code</button>
                        </CountDownButtonWrapper>

                    </div>

                    <button type="submit" className="btn border border-secondary w-full"> Register </button>
            </form>
            {message === undefined? <></> : <p> {message} </p>}
        </div>
    )
}

