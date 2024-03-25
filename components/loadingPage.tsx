export default function(){
    const message:string[] = ["", "Please wait"]
    const randomInt:number = Math.floor(Math.random()*message.length)
    return(
        <div className="flex flex-col justify-center min-h-screen items-center px-4 pb-60">
            <p>Loading...</p>
            <p>{message[randomInt]}</p>
        </div>
    )
}