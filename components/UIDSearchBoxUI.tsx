import { promises } from "fs";

interface UIDInputProps {
    UIDInput: React.RefObject<HTMLInputElement>;
    searchButtonClicked: (event: React.MouseEvent<HTMLButtonElement>) => void|Promise<void>;
}
export default function({UIDInput, searchButtonClicked}:UIDInputProps){

    return(
        <div className="flex flex-row align-middle gap-3 key-element w-4/5 m-auto">
            <p className="text-center font-semibold p-3 text-2xl"> UID:</p>
            <input ref={UIDInput}type="text" placeholder="Type here" className="input input-bordered w-full grow text-lg"/>
            <button onClick={searchButtonClicked} className="btn border-secondary hover:bg-secondary text-lg"> Search </button>
        </div>
    )
}