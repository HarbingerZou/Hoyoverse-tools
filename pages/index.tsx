import { useState } from "react";
import { useRef } from "react";
import { Helmet } from "react-helmet";
import LoadingPage from "../components/loadingPage"
import { FormattedRelic, UserInfo } from "./api/JSONStructureOwn";
import { CharacterWithStats } from "./api/JSONStructureOwn";
import { elementMapper } from "../utils/renameMethod";
import React from "react";
import RelicView from "../components/relicView"
import style from "./scorer.module.css"
import CustomCollapse from "../components/collapse";
import { parseStat } from "../utils/renameMethod";
export default function userInfo(){
    const UIDInput = useRef<HTMLInputElement>(null);
    //const [UID,setUID] = useState(0);
    const [userInfo, setUserInfo] = useState<UserInfo|undefined>(undefined);
    const [loading,setLoading] = useState(false);
    //const {status, data} = useSession();
    async function searchButtonClicked(evt:React.MouseEvent){
        if(loading){
            return;
        }
        const UIDString = UIDInput.current?.value;
        const UID = Number(UIDString)
        if (!UIDString || UIDString === "" || isNaN(UID)){
            setUserInfo(undefined)
            return;
        }
        
        setLoading(true);
        //console.log(UID);
        fetch(`/api/scorer?uid=${UID}`)
        .then(response => response.json())
        .then((data) => {              
            setUserInfo(data);
            setLoading(false);
        });
    }

    //console.log("userINfo:",userInfo);
    let infoPanel = 
        <>
            <p className="justify-center text-center">Display the characters you want to score as Starfaring Companions in the game and enter your UID</p>
            <p className="justify-center text-center">If you just changed your characters' suits in the game, it may take roughly 3 minutes for the result to change </p>
        </>

    if(loading){
        infoPanel = <LoadingPage />
    }else if(userInfo !== undefined && Object.keys(userInfo).length === 0){
        infoPanel = <p className="text-center">UID {UIDInput.current?.value} is not a valid UID</p>
    }else if(userInfo !== undefined){
        infoPanel = <User userInfo = {userInfo}/>
    }

    return (
        <>
            <Helmet>
				<title>Honkai: Star Rail Relic Scorer/Rater.</title>
                <meta name="description" content="Honkai Star Rail: Get Your Relic/Ornament Scores Simply by Entering Your UID"/>
			</Helmet>
            <div className="body flex flex-col">
                <h3 className="text-center text-2xl align-center font-medium">Honkai: Star Rail Relic Scorer</h3>
                <div className="flex flex-row align-middle gap-3 key-element w-3/5 m-auto">
                    <p className="text-center font-semibold p-3 text-lg"> UID:</p>
                    <input ref={UIDInput}type="text" placeholder="Type here" className="input input-bordered w-full grow"/>
                    <button onClick={searchButtonClicked} className="btn border-secondary hover:bg-secondary"> Search </button>
                </div>
                {infoPanel}
            </div>
        </>
    );
};

function User({userInfo}:{userInfo:UserInfo}){
    //console.log(userInfo);
    const avatars = userInfo.avatars;
    const [avatarShown,setAvatarShown] = useState(avatars[0]);
    //avatarShown.weights can be undefined if the avatar doesn't have any relics.
    const formula = avatarShown===undefined || avatarShown.weights === undefined? <></>: <FormluaArea character={avatarShown} userInfo = {userInfo}/>
    const characters = avatarShown===undefined?
    <p>Please Add Some Characters as Your Starfaring Companions in Your trailblazer Profile</p>: 
    <>
        <CharacterButton characters={avatars} avatarShown={avatarShown} setAvatarShown={setAvatarShown}/>

        <SingleCharacter character={avatarShown}/>

        {formula}
    </>
    return(
        <div className="flex flex-col align-middle gap-5">
            <div className="flex flex-col align-middle gap-1">
                <p className="text-center font-semibold text-lg">{userInfo.name} </p>
                <p className="text-center font-semibold text-lg">{userInfo.level} </p>
            </div>
            {characters}
        </div>
    )
}


function CharacterButton({characters, avatarShown, setAvatarShown}:{characters:CharacterWithStats[], avatarShown: CharacterWithStats, setAvatarShown: (newCharacter:CharacterWithStats)=> void }){
    function mapper(character:CharacterWithStats){
        return(
            <button key={character.name} onClick={()=>setAvatarShown(character)} className="btn border-secondary hover:bg-secondary w-32 sm:w-28 text-base sm:text-sm">
                {character.name}
            </button>
        )
    }
    
    return(
        <div className="flex flex-row flex-wrap justify-center">
            {characters.map(character=>mapper(character))}
        </div>
    )
}


function SingleCharacter({character}:{character:CharacterWithStats}){
    //console.log(character);

    return(
        <div className="flex flex-col justify-center screenFit">
            <div className="flex flex-row justify-center items-start flex-wrap"> 
                <img src={`/starrail/Characters/${character.name}/${character.name}.png`} className="w-1/3"/>
                <StatsBox character={character} />

            </div>
            <div className="grid grid-cols-3">  
                {character.relics.map((relic,index) => {
                    relic = FormattedRelic.fromObject(relic)
                    return <RelicView relic={relic}/>
                })}
            </div>
            <InfoBoxArea character={character}/>
        </div>
    )
}

function StatsBox({character}:{character:CharacterWithStats}){
    return (
        <div className={style.stats}>
            <h3 className="font-semibold text-lg"> {character.name} </h3>
            <h3 className="font-semibold text-lg"> LV:{character.level} </h3>
            <h3 className="font-semibold text-lg"> Total Score: {character.totalScore}</h3>
            <div className="flex flex-row gap-2">
                <p> HP: </p>
                <p> {character.combatValues.hpFinal}</p>
                <p>{character.combatValues.hpBase} </p>
                <p>+{character.combatValues.hpFinal - character.combatValues.hpBase}</p>
            </div>
            <div className="flex flex-row gap-2">
                <p> ATK: </p>
                <p>{character.combatValues.attackFinal}</p>
                <p>{character.combatValues.attackBase} </p>
                <p>+{character.combatValues.attackFinal - character.combatValues.attackBase}</p>
            </div>
            <div className="flex flex-row gap-2">
                <p> DEF: </p>
                <p> {character.combatValues.defenseFinal}</p>
                <p>{character.combatValues.defenseBase} </p>
                <p>+{character.combatValues.defenseFinal - character.combatValues.defenseBase}</p>
            </div>
            <div className="flex flex-row gap-2">
                <p> Speed: </p>
                <p>{character.combatValues.speedFinal}</p>
                <p>{character.combatValues.speedBase} </p>
                <p>+{character.combatValues.speedFinal - character.combatValues.speedBase}</p>
            </div>

            <div className="flex flex-row">
                <p> CRIT Rate:</p>
                <p> {character.combatValues.criticalChance}%</p>
            </div>
            <div className="flex flex-row">
                <p> CRIT DMG: </p>
                <p> {character.combatValues.criticalDamage}%</p>
            </div>
            <div className="flex flex-row">
                <p> Break Effect: </p>
                <p>{character.combatValues.stanceBreakRatio}%</p>
            </div>
            <div className="flex flex-row">
                <p> Effect HIT Rate: </p>
                <p> {character.combatValues.statusProbability}%</p>
            </div>
            <div className="flex flex-row">
                <p> Outgoing Healing Boost: </p>
                <p> {character.combatValues.healRatio}%</p>
            </div>
            <div className="flex flex-row">
                <p> Energy Regen Rate Boost: </p>
                <p> {character.combatValues.spRatio}%</p>
            </div>
            <div className="flex flex-row">
                <p> Effect RES: </p>
                <p>{character.combatValues.statusResistance}%</p>
            </div>
            <div className="flex flex-row">
                <p> {elementMapper(character.element)} DMG Boost: </p>
                <p>{character.combatValues[`${character.element}AddHurt`]}%</p>
            </div>
        </div>
    )
}

function InfoBoxArea({character}:{character:CharacterWithStats}){
    const InfoBoxes = [];
    const infosWhole = character.info
    if(infosWhole === undefined){
        return <></>
    }
    const globalEffectList = infosWhole.globalEffectList
    const singleInfoList = infosWhole.infos
    for(const info of singleInfoList){
        const PreviewBox = <div className="flex flex-col">
            <h3 className="text-lg font-medium">{info.name}</h3>
            <p>{Math.round(info.value*100)/100}</p>
        </div>

        const OptionalText = <div>
            <div className="flex flex-col border border-secondary p-4">
                {Object.entries(info.multipliers).map(([name, value])=>
                    <div className="flex flex-row justify-between p-1">
                        <p>{name}</p>
                        <p>{Math.round(value*100)/100}</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col border border-primary">
                <h3 className="text-lg font-medium">Local Skill Effect List:</h3>
                {info.notes.map(note=>
                    <p>{note}</p>
                )}
            </div>
        </div>
        InfoBoxes.push( <CustomCollapse alwaysDisplay={PreviewBox} optionalDisplay={OptionalText} />)

    }
    return(
        <div className="flex flex-col border-secondary">
            <div className="flex flex-row"> {InfoBoxes} </div>
            <div className="flex flex-col border border-secondary p-4"> 
                <h3 className="text-lg font-medium">Global Effect List:</h3>
                {infosWhole.globalEffectList.map(effct=>
                    <p>{effct}</p>
                )}
            </div>
        </div>
    )
}

function FormluaArea({character, userInfo}:{character:CharacterWithStats, userInfo:UserInfo}){
    //console.log(character);
    const weights = character.weights? Object.entries(character.weights) : [];
    const factors = character.weights? Object.entries(userInfo.factors) : [];
    //console.log(weights);
    return(
        <div className="flex flex-col gap-2">
            <div>
                <h3 className="text-xl font-medium">Relic Score compose three parts:</h3>
                <p>Difficult score: 10*level/15 when main stats are correct for Body and Planar Sphere</p>
                <p>Main stat' score: 5.83*weight for all types of relic and ornament except Head and Hand </p>
                <p>Sub stats' scores: weight*factor*value </p>
            </div>
        
            <div className="flex flex-col">
                <h3 className="text-xl font-medium">{character.name}'s weight </h3>
                <div className="grid grid-cols-6">
                    {weights.map(weight => (
                        <p key={weight[0]} className="border p-1 border-secondary"> {weight[0]}: {weight[1]}</p> 
                    ))}
                </div>
            </div>


            <div className="flex flex-col">
                <h3 className="text-xl font-medium"> Factors</h3>
                <div className="grid grid-cols-6">
                    {factors.map(factor => (
                        <p key={factor[0]} className="border p-1 border-secondary"> {factor[0]}: {factor[1]}</p> 
                    ))}
                </div>
            </div>
        </div>
    )
}

