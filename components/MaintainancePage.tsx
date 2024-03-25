export default function(){
    const message:string[] = ["", "Please Come back Later"]
    const randomInt:number = Math.floor(Math.random()*message.length)
    return(
        <div className="flex flex-col justify-center min-h-screen items-center px-4 pb-60">
            <p>This page is under maintenance</p>
            <p>{message[randomInt]}</p>
        </div>
    )
}