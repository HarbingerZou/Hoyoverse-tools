import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Helmet } from "react-helmet";
import uid_search_style from "./scorer.module.css"
import OnHoverButtonWrapper from "../components/onHoverButton";
import LoadingPage from "../components/loadingPage"
import { FormattedRelic, UserInfo } from "./api/JSONStructureOwn";
import { CharacterWithStats } from "./api/JSONStructureOwn";
import { elementMapper } from "../utils/renameMethod";

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
        const UID = UIDInput.current?.value;
        if (!UID || UID === ""){
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
            <p style={{textAlign:"center"}}>Display the characters you want to score as Starfaring Companions in the game and enter your UID</p>
            <p style={{textAlign:"center"}}>If you just changed your characters' suits in the game, it may take roughly 3 minutes for the result to change </p>
        </>

    if(loading){
        infoPanel = <LoadingPage />
    }else if(userInfo !== undefined && Object.keys(userInfo).length === 0){
        infoPanel = <p style={{textAlign:"center"}}>UID {UIDInput.current?.value} is not a valid UID</p>
    }else if(userInfo !== undefined){
        infoPanel = <User userInfo = {userInfo}/>
    }

    return (
        <>
            <Helmet>
				<title>Honkai: Star Rail Relic Scorer/Rater.</title>
                <meta name="description" content="Honkai Star Rail: Get Your Relic/Ornament Scores Simply by Entering Your UID"/>
			</Helmet>
            <div className="body">
                <h3>Honkai: Star Rail Relic Scorer</h3>
                <div className={uid_search_style.search_button}>
                    <h3> UID:</h3>
                    <input type="number"  id="uid" ref={UIDInput} /> 
                    <OnHoverButtonWrapper>
                        <p onClick={searchButtonClicked}> Search </p>
                    </OnHoverButtonWrapper>
                </div>
                {infoPanel}
            </div>
        </>
    );
};

function User({userInfo}:{userInfo:UserInfo}){
    const avatars = userInfo.avatars;
    const [avatarShown,setAvatarShown] = useState(avatars[0]);

    //console.log(userInfo);
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
        <div className={uid_search_style.user_page}>
            <div>
                <p>{userInfo.name} </p>
                <p>{userInfo.level} </p>
            </div>
            {characters}
        </div>
    )
}


function CharacterButton({characters, avatarShown, setAvatarShown}:{characters:CharacterWithStats[], avatarShown: CharacterWithStats, setAvatarShown: (newCharacter:CharacterWithStats)=> void }){
    function mapper(character:CharacterWithStats){
        return(
            <button key={character.name} onClick={()=>setAvatarShown(character)}>
                {character.name}
            </button>
        )
    }
    
    return(
        <div className={uid_search_style.button_area}>
            {characters.map(character=>mapper(character))}
        </div>
    )
}


function SingleCharacter({character}:{character:CharacterWithStats}){
    //console.log(character);

    return(
        <div className={uid_search_style.character_page}>
            <div className={uid_search_style.overview}> 
                <img src={`/starrail/Characters/${character.name}/${character.name}.png`}/>
                <StatsBox character={character} />

            </div>
            <div className={uid_search_style.relic_grid}>  
                {character.relics.map((relic,index) =>
                    <RelicBox relic={relic}/>
                )}
            </div>
        </div>
    )
}

function StatsBox({character}:{character:CharacterWithStats}){
    return (
        <div className={uid_search_style.stats}>
            <h3> {character.name} </h3>
            <h3> LV:{character.level} </h3>
            <h3> Total Score: {character.totalScore}</h3>
            <div>
                <p> HP: </p>
                <p> {character.combatValues.hpFinal}</p>
                <p>{character.combatValues.hpBase} </p>
                <p>+{character.combatValues.hpFinal - character.combatValues.hpBase}</p>
            </div>
            <div>
                <p> ATK: </p>
                <p>{character.combatValues.attackFinal}</p>
                <p>{character.combatValues.attackBase} </p>
                <p>+{character.combatValues.attackFinal - character.combatValues.attackBase}</p>
            </div>
            <div>
                <p> DEF: </p>
                <p> {character.combatValues.defenseFinal}</p>
                <p>{character.combatValues.defenseBase} </p>
                <p>+{character.combatValues.defenseFinal - character.combatValues.defenseBase}</p>
            </div>
            <div>
                <p> Speed: </p>
                <p>{character.combatValues.speedFinal}</p>
                <p>{character.combatValues.speedBase} </p>
                <p>+{character.combatValues.speedFinal - character.combatValues.speedBase}</p>
            </div>

            <div>
                <p> CRIT Rate:</p>
                <p> {character.combatValues.criticalChance}%</p>
            </div>
            <div>
                <p> CRIT DMG: </p>
                <p> {character.combatValues.criticalDamage}%</p>
            </div>
            <div>
                <p> Break Effect: </p>
                <p>{character.combatValues.stanceBreakRatio}%</p>
            </div>
            <div>
                <p> Effect HIT Rate: </p>
                <p> {character.combatValues.statusProbability}%</p>
            </div>
            <div>
                <p> Outgoing Healing Boost: </p>
                <p> {character.combatValues.healRatio}%</p>
            </div>
            <div>
                <p> Energy Regen Rate Boost: </p>
                <p> {character.combatValues.spRatio}%</p>
            </div>
            <div>
                <p> Effect RES: </p>
                <p>{character.combatValues.statusResistance}%</p>
            </div>
            <div>
                <p> {elementMapper(character.element)} DMG Boost: </p>
                <p>{character.combatValues[`${character.element}AddHurt`]}%</p>
            </div>
        </div>
    )
}
/*
function DamageBox({character}:{character:CharacterWithStats}){
    return(
        <div>
           {character.basicDamage? <p>{character.basicDamage.expectDamage}</p> : <></>}
           {character.basicDamage? <p>{character.basicDamage.critDamage}</p> : <></>}
        </div>
    )
}*/

function FormluaArea({character, userInfo}:{character:CharacterWithStats, userInfo:UserInfo}){
    //console.log(character);
    const weights = character.weights? Object.entries(character.weights) : [];
    const factors = character.weights? Object.entries(userInfo.factors) : [];
    //console.log(weights);
    return(
        <div className={uid_search_style.info}>
            <div className={uid_search_style.introduction}>
                <h3>Relic Score compose three parts:</h3>
                <p>Difficult score: 10*level/15 when main stats are correct for Body and Planar Sphere</p>
                <p>Main stat' score: 5.83*weight for all types of relic and ornament except Head and Hand </p>
                <p>Sub stats' scores: weight*factor*value </p>
            </div>
        
            <div className={uid_search_style.formula_area}>
                <h3>{character.name}'s weight </h3>
                <div>
                    {weights.map(weight => (
                        <p key={weight[0]} className={uid_search_style.formula_entry}> {weight[0]}: {weight[1]}</p> 
                    ))}
                </div>
            </div>


            <div className={uid_search_style.formula_area}>
                <h3> Factors</h3>
                <div>
                    {factors.map(factor => (
                        <p key={factor[0]} className={uid_search_style.formula_entry}> {factor[0]}: {factor[1]}</p> 
                    ))}
                </div>
            </div>
        </div>
    )
}

function RelicBox({relic}:{relic:FormattedRelic}){
    //console.log(relic);
    return(
        <div className={uid_search_style.relic_box}>
            <div>
                <div>
                    <p>{relic.setName}</p>
                    <div>
                        <p>{relic.score}</p>
                        <p>{relic.rate}</p>
                    </div>
                </div>
                <div> 
                    <p>{relic.type} </p>
                    <p>+{relic.level} </p>
                </div>
            </div>

            <div>
                <div>
                    <p>{relic.mainAffix.type} </p>
                    <p>{relic.mainAffix.valueString} </p>
                </div>
                {relic.subAffix.map((affix,index)=>(
                    <div key={index}>
                        <p>{affix.type}</p>
                        <p>{affix.valueString}</p>
                    </div>)
                )}
            </div>
        </div>
    )
}
