interface UIDInputProps {
    UIDInput: React.RefObject<HTMLInputElement>;
    searchButtonClicked: () => void;
}
export default function({UIDInput, searchButtonClicked}:UIDInputProps){

    return(
        <div className="flex flex-row align-middle gap-3 key-element w-3/5 m-auto">
            <p className="text-center font-semibold p-3 text-lg"> UID:</p>
            <input ref={UIDInput}type="text" placeholder="Type here" className="input input-bordered w-full grow"/>
            <button onClick={searchButtonClicked} className="btn border-secondary hover:bg-secondary"> Search </button>
        </div>
    )
}