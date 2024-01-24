import Link from "next/link"
import style from "./header.module.css"
import OnHoverButtonWrapper from "./onHoverButton";
import { useRouter } from "next/router";
import { useState } from "react";
import { useContext } from "react";
import React from "react";

const MenuButtonContext = React.createContext();


export default function() {
  return (
      <header className={style.header}>
        <Header/>
      </header>
  );
}

function Header(){
  
  return(
    <div className={style.mainHeader}>
      <div>
        <div>
          <Link href={"/"}>
            <h3>Hoyoverse.gg</h3>
          </Link>
        </div>
      </div>

    </div>
  )
}