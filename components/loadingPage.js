import style from "./loadingPage.module.css"
export default function(){
    const message = ["", "Please wait"]
    const randomInt = Math.floor(Math.random()*message.length)
    return(
        <div className={style.loadingMessage}>
            <p>Loading...</p>
            <p>{message[randomInt]}</p>
        </div>
    )
}