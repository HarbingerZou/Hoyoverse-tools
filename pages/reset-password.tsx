import {ClientSafeProvider, LiteralUnion, getProviders,signIn} from 'next-auth/react'
import { useRef, useState, } from 'react'
import useRacingCheckWrapper from '../utils/racingCheck'
import CountDownButtonWrapper from '../components/countDownButtonWrapper'
import Router from "next/router";
import Link from 'next/link';

export default function(){
    const [lockedEmail, setLockedEmail] = useState<string|undefined>(undefined)
    const [verifyPassed, setVerifyPassed] = useState<boolean>(false)
    let content = <></>
    if(verifyPassed){
        content = <NewPasswordBox lockedEmail={lockedEmail}/>
    }else{
        content = <EmailBox setLockedEmail={setLockedEmail} lockedEmail={lockedEmail} setVerifyPassed={setVerifyPassed}/>
    }
    //console.log(lockedEmail)
    return(
        <div className="body">
            <div className='flex flex-col items-center border border-secondary px-8 py-16 gap-6'>
                <img src="/Honkai_Star_Rail.webp" alt = "Honkai:Star Rail" className="w-32"/>
                <h2>Forgot Password</h2>
                {content}
                <Link href={"/signIn"} className='text-sm'> &lt; Back to Sign In</Link>
            </div>
        </div>
    )
}

function NewPasswordBox({lockedEmail}:{lockedEmail:String|undefined}){
    const password = useRef<HTMLInputElement>(null);
    const password2 = useRef<HTMLInputElement>(null);

    const [message, setMessage] = useState<string | undefined>(undefined);;
    const handlePasswordReset = async () => {
        // Check if both passwords are entered and match
        if (password.current?.value && password2.current?.value) {
            if (password.current.value === password2.current.value) {
                try {
                    // Replace 'your-backend-endpoint' with the actual endpoint
                    const response = await fetch('your-backend-endpoint', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email:lockedEmail,
                            password: password.current.value,
                        }),
                    });
                    setMessage("Password reset successfully.");
                    Router.push("/signIn");
                    
                } catch (error) {
                    // Handle error
                    console.error("Failed to reset password", error);
                    setMessage("Failed to reset password.");
                }
            } else {
                // Passwords do not match
                setMessage("Passwords do not match.");
            }
        } else {
            setMessage("Please fill in both password fields.");
        }
    };

    return (
        <div className='flex flex-col w-full gap-6'>
            <input type="password" name="password" placeholder="Enter Your New Password" required ref={password} className="input input-bordered w-full grow"/>
            <input type="password" name="password2" placeholder="Re-enter your password" required ref={password2} className="input input-bordered w-full grow"/>
            {message !== undefined && <p>{message}</p>}
            <button onClick={handlePasswordReset} className="btn border border-secondary">Verify</button>
        </div>
    );
}

function EmailBox({setLockedEmail, lockedEmail, setVerifyPassed}:{setLockedEmail:Function, lockedEmail:string|undefined, setVerifyPassed:Function}){
    const email = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [code,setCode] = useState<string|undefined>(undefined)
    const verification_code = useRef<HTMLInputElement>(null);

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
        

        const response1 = await fetch(`/api/checkUserExist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email:email.current.value
            }),
        });

        const {message, success} = await response1.json();
        //console.log(message)
        //console.log(success)

        if(!success){
            setMessage(message)
            return true
        }

        const response2 = await fetch(`/api/sendVerificationCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(email.current.value),
        });
    
    
        const data = await response2.json();
        const {error, verificationCode} = data
        //console.log(data)
        if(error){
            setMessage(error)
            return true
        }else{
            setCode(verificationCode)
            setLockedEmail(email.current.value)
            return true
        }
    }
    const protectedVerify = useRacingCheckWrapper(verify);

    async function submitPressed({evt}:any){
        //waiting for sever response;
        console.log("evnet run normally")
        evt.preventDefault();
        setMessage(undefined);
        //console.log("evnet run normally")

        if(verification_code.current === null||email.current === null){
            setMessage("React Dom Error")
            return false
        }
        if(email.current.value === ""){
            setMessage("Please Enter Your Email")
            return false
        }
        console.log("react run normally")
        if(verification_code.current.value !== code){
            setMessage("Incorrect Verification Code")
            return false
        }
    
        if(email.current.value !== lockedEmail){
            setMessage("The email address does not match the intended recipient of the code")
            return false
        }
        setVerifyPassed(true)
        return false;
    }
    const protectedSubmit = useRacingCheckWrapper(submitPressed)

    return(
        <div className='flex flex-col w-full gap-6'>
            <input type="email" name="email" placeholder = "email" ref={email} className="input input-bordered w-full grow" />
            <div className='flex felx-row gap-2'>
                <input type="text" name="code"  placeholder="verification code" ref={verification_code} className="input input-bordered grow"/>
                <CountDownButtonWrapper countDownSecond={60}>
                    <button onClick={(evt) => protectedVerify({evt, email,setMessage})} className="btn border border-secondary">Get Code</button>
                </CountDownButtonWrapper>
            </div>
            {message==undefined?<></>:<p>{message}</p>}
            <button onClick={(evt)=>protectedSubmit({evt})} className="btn border border-secondary">submit</button>
        </div>
    )
}
