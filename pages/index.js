import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Helmet } from "react-helmet";
import uid_search_style from "./scorer.module.css"
import OnHoverButtonWrapper from "../components/onHoverButton";
import LoadingPage from "../components/loadingPage"

export default function userInfo(){
    const UIDInput = useRef(null);
    //const [UID,setUID] = useState(0);
    const [userInfo, setUserInfo] = useState(undefined);
    const [loading,setLoading] = useState(false);
    //const {status, data} = useSession();
    async function searchButtonClicked(evt){
        if(loading){
            return;
        }
        const UID = UIDInput.current.value;
        if (UID === ""){
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
    let characters = 
        <>
            <p style={{textAlign:"center"}}>Display the characters you want to score as Starfaring Companions in the game and enter your UID</p>
            <p style={{textAlign:"center"}}>If you just changed your characters' suits in the game, it may take roughly 3 minutes for the result to change </p>
        </>
    if(loading){
        characters = <LoadingPage />
    }else if(userInfo !== undefined && Object.keys(userInfo).length === 0){
        characters = <p style={{textAlign:"center"}}>UID {UIDInput.current.value} is not a valid UID</p>
    }else if(userInfo !== undefined){
        characters = <User userInfo = {userInfo}/>
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
                {characters}
            </div>
        </>
    );
};

function User({userInfo}){
    const avatars = userInfo.avatars;
    const [avatarShown,setAvatarShown] = useState(avatars[0]);

    //console.log(userInfo);
    //avatarShown.weights can be undefined if the avatar doesn't have any relics.
    const formula = avatarShown===undefined || avatarShown.weights === undefined? <></>: <FormluaArea character={avatarShown} userInfo = {userInfo}/>
    const characters = avatarShown===undefined?
    <p>Please Add Some Characters as Your Starfaring Companions in Your trailblazer Profile</p>: 
    <>
        <CharacterButton characters={avatars} avatarShown={avatarShown} setavAtarShown={setAvatarShown}/>

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


function CharacterButton({characters, avatarShown, setavAtarShown}){
    function mapper(character){
        return(
            <button key={character.name} onClick={()=>setavAtarShown(character)}>
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


function SingleCharacter({character}){
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

function StatsBox({character}){
    return (
        <div className={uid_search_style.stats}>
            <h3> {character.name} </h3>
            <h3> LV:{character.level} </h3>
            <h3> Total Score: {character.totalScore}</h3>
            <div>
                <p> HP: </p>
                <p> {character.combateValues.hpFinal}</p>
                <p>{character.combateValues.hpBase} </p>
                <p>+{character.combateValues.hpFinal - character.combateValues.hpBase}</p>
            </div>
            <div>
                <p> ATK: </p>
                <p>{character.combateValues.attackFinal}</p>
                <p>{character.combateValues.attackBase} </p>
                <p>+{character.combateValues.attackFinal - character.combateValues.attackBase}</p>
            </div>
            <div>
                <p> DEF: </p>
                <p> {character.combateValues.defenseFinal}</p>
                <p>{character.combateValues.defenseBase} </p>
                <p>+{character.combateValues.defenseFinal - character.combateValues.defenseBase}</p>
            </div>
            <div>
                <p> Speed: </p>
                <p>{character.combateValues.speedFinal}</p>
                <p>{character.combateValues.speedBase} </p>
                <p>+{character.combateValues.speedFinal - character.combateValues.speedBase}</p>
            </div>

            <div>
                <p> CRIT Rate:</p>
                <p> {character.combateValues.criticalChance}%</p>
            </div>
            <div>
                <p> CRIT DMG: </p>
                <p> {character.combateValues.criticalDamage}%</p>
            </div>
            <div>
                <p> Break Effect: </p>
                <p>{character.combateValues.stanceBreakRatio}%</p>
            </div>
            <div>
                <p> Effect HIT Rate: </p>
                <p> {character.combateValues.statusProbability}%</p>
            </div>
            <div>
                <p> Outgoing Healing Boost: </p>
                <p> {character.combateValues.healRatio}%</p>
            </div>
            <div>
                <p> Energy Regen Rate Boost: </p>
                <p> {character.combateValues.spRatio}%</p>
            </div>
            <div>
                <p> Effect RES: </p>
                <p>{character.combateValues.statusResistance}%</p>
            </div>
            <div>
                <p> {character.elementString} DMG Boost: </p>
                <p>{character.combateValues[`${character.element}AddHurt`]}%</p>
            </div>
        </div>
    )
}

function DamageBox({character}){
    return(
        <div>
           {character.basicDamage? <p>{character.basicDamage.expectDamage}</p> : <></>}
           {character.basicDamage? <p>{character.basicDamage.critDamage}</p> : <></>}
        </div>
    )
}

function FormluaArea({character, userInfo}){
    console.log(character);
    const weights = Object.entries(character.weights);
    const factors = Object.entries(userInfo.factors);
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

function RelicBox({relic}){
    //console.log(relic);
    return(
        <div className={uid_search_style.relic_box}>
            <div>
                <div>
                    <p>{relic.set}</p>
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
