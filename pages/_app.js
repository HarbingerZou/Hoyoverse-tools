import "./tailwind.css"
import "./style.css"
import Head from "next/head"
import Header from "../components/header"
import Script from 'next/script'
import { SessionProvider } from "next-auth/react"
//import { Head } from "next/document"
//import { SessionProvider } from "next-auth/react"
//import { useSession } from "next-auth/react"
export default function MyApp({ Component, pageProps:{session, ...pageProps} }) {
  

  return (
    <SessionProvider>
      <Head>
          <link rel="icon" href="Honkai_Star_Rail.webp" type="image/icon type"></link>
				  <title>Guide website for all Mihoyo's Game</title>
          <meta name="description" content="Best Guide website for all Mihoyo's Game"/>
      </Head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6975458143406021"
        crossOrigin="anonymous"></script>
      <Header />
      <div className="min-h-screen bg-primary">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
    )
}