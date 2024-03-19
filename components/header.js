import Link from "next/link"
import { useRouter } from "next/router";
import { useState } from "react";
import { useContext } from "react";
import React from "react";

const MenuButtonContext = React.createContext();


export default function() {
  return (
      <header className="border-b border-secondary ">
        <Header/>
      </header>
  );
}

function Header(){
  
  return(
    <div>
      <div>
        <div>
          <Link href={"/"}>
            <h3 className="text-xl p-3 font-semibold">Hoyoverse.gg</h3>
          </Link>
        </div>
      </div>

    </div>
  )
}