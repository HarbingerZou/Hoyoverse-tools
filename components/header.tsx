import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function() {
  return (
      <header className="fixed w-full">
        <Header/>
      </header>
  );
}

function Header(){
  const [isOpen, setIsOpen] = useState(false);
  
  return(
    <div className="flex flex-col items-end">
      <div className="border-b border-secondary w-full">
        <div className="flex flex-row justify-between items-center px-6 py-2">
          <Link href={"/"}>
            <h3 className="text-xl font-semibold">Hoyoverse.gg</h3>
          </Link>

          <button  onClick={()=>setIsOpen(!isOpen)}>
            {isOpen?
              <svg className="fill-current w-8 transition-transform duration-500 rotate-90 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>:
              <svg className={`fill-current w-8 transition-transform duration-500 `} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
            }
            </button>
        </div>
      </div>
      <AccountIconArea setIsOpen={setIsOpen} isOpen = {isOpen}/>
    </div>
  )
}


function AccountIconArea({setIsOpen, isOpen}:{setIsOpen:Function, isOpen:boolean}) {
  // Simplified version, leveraging the `isOpen` prop for transitions
  const {status, data} = useSession();
  const router = useRouter();
  const transitionDuration = 500; // Transition duration can be adjusted as needed
  const [isEffective, setIsEffective] = useState(false)
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    // Function to handle closing the banner on route change
    const handleRouteChange = () => {
      setIsOpen(false);

    }
    // Adding the route change event listener
    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup function to remove the event listener
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events, setIsOpen]);


  useEffect(()=>{
    if(isOpen){
      setIsEffective(isOpen)
      setTimeout(()=>{
        setDisplay(isOpen)
      },50)
    }else{
      setDisplay(isOpen)
      setTimeout(()=>{
        setIsEffective(isOpen)
      },transitionDuration)
    }
  },[isOpen])

  
  const authenticated = status === "authenticated";

  let signIn = <Link href="/signIn" className="text-lg p-4 font-medium">Log In</Link>;
  if (authenticated && data?.user) {
    signIn = (
      <>
        <p className="text-lg p-4 font-medium">
          {data.user.name}
        </p>
        <p onClick={() => signOut()} className="cursor-pointer text-lg p-4 font-medium">
          Log Out
        </p>
      </>
    );
  }

  return (
    <div className={`flex flex-col items-start w-1/2 bg-primary h-screen px-4 py-2 transition-transform duration-500 ${display ? 'translate-x-0' : 'translate-x-full'} ${isEffective? '':"hidden"}`}>
      {authenticated && <Link href="/build-customizer" className="text-lg p-4 font-medium">Build Customizer</Link>}
      {authenticated && <Link href="/backpack" className="text-lg p-4 font-medium">Inventory</Link>}
      {signIn}
    </div>
  );
}