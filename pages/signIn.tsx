import {ClientSafeProvider, LiteralUnion, getProviders,signIn} from 'next-auth/react'
import { useState, } from 'react'
import Link from 'next/link';
import { BuiltInProviderType } from 'next-auth/providers';
interface SignInProps {
	providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
}

export default function({providers}:SignInProps){
	const [message,setMessage] = useState<String|undefined>(undefined);
	const [email, setEmail] = useState('');
  	const [password, setPassword] = useState('');

	async function signInClicked(evt:React.FormEvent<HTMLFormElement>){
		evt.preventDefault();
		setMessage(undefined)
		const input = {
			email: email,
			password: password,
		};
		const result = await signIn('credentials',{
			redirect: false,
			...input,
		});
		if (!result?.error) {
			// Handle successful authentication here
			window.location.href = '/';
			console.log('User successfully logged in!');
		} else {
			// Display the error message from the server
			setMessage(result.error);
		}
	}


    return(
		<div className='body'>
			<div className='flex flex-col items-center border border-secondary px-8 py-16 gap-6'>
				<img src="/Honkai_Star_Rail.webp" alt = "Honkai:Star Rail" className='w-32'/>	
				{Object.values(providers).map(function(provider){
					if(provider.id !== "credentials"){
						return (
							<button onClick={()=>{signIn(provider.id)}} key={provider.id}>Sign in with {provider.name}</button>
						)
					}else{
						return(
							<>
								<h1 className='text-lg'>Log in with Credentials</h1>
								<form key={provider.id} onSubmit={signInClicked} className='flex flex-col items-start w-full grow gap-4'>
									<input type="text" name="email" placeholder = "email" required onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full grow"/>
									<input type="password" name="password"  placeholder = "password" required  onChange={(e) => setPassword(e.target.value)} className='input input-bordered w-full grow' />
									{message?<p>{message}</p>: <></>}
									<button type="submit" className='btn rounded-lg w-full my-4'>Log In</button>
								</form>
							</>
						)
					}
				})}
				<div className='flex flex-row items-center justify-between w-full'>
					<Link href={"/signUp"}>Sign Up</Link>
					<Link href={"/reset-password"}>Forgot Password?</Link>
				</div>
			</div>
		</div>
    )
}

export async function getServerSideProps(context:any){
	//console.log("context",context);
	const providers = await getProviders()
	//console.log(providers);
	return{
		props:{providers},
	}
}