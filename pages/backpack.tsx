//import {useSession } from "next-auth/react";
import React, { ReactElement, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import LoadingPage from '../components/loadingPage';

import FilterButton from '../components/filterButton';
import Searchbox from '../components/HSRInfoFetchBox';

import RelicInstanceIcon from '../components/RelicInstanceIcon';
import RelicViewBox from "../components/relicView"
import UIDBars from '../components/UIDBars';

import { HsrInfoInterface, RelicBriefInterface, RelicType, UserInterface } from '../utils/starrail/SharedTypes';
import { parseType } from '../utils/renameMethod';
import { processState } from '../utils/starrail/stateRelatedShareTyps';
import { UserInfo } from './api/JSONStructureOwn';

let refreshPage:() => Promise<void>;

export default function Page(){
    const {status, data} = useSession()
    //console.log(data);
    const authenticated = status === "authenticated"
    if(status === "loading"){
        return
    }
    
    if(!authenticated){
        return(
            <div className='body'>
                <p>Please sign in first</p>
            </div>
        )
    }else{
        return <SignedInPage/>
    }
}

function SignedInPage(){
    //if the page is loading
    const [loading, setLoading] = useState<boolean>(true);

    //all the UID infos, can be undefined
    const [playerInfo, setPlayerInfo] = useState<UserInterface|null>(null);
    //selected UID, can be undefined
    const [selectedInfo, setSelectedInfo] = useState<HsrInfoInterface|null>(null);
    const [selectedRelicList, setSelectedRelicList] = useState<RelicBriefInterface[]|null>(null);
    const [selectedRelic, setSelectedRelic] = useState<RelicBriefInterface|null>(null);

    const [filterType,setFilterType] = useState<RelicType|null>(null);

    const [fetchingState, setFetchingState] = useState<processState>("initial");

    //initialize the refresh page function when loading
    useEffect(()=>{
        refreshPage = async ()=>{    
            setFetchingState("loading");
            const response = await fetch("/api/userInfo");
            const {user:data} = await response.json();
            if(data){
                setPlayerInfo(data);
            }
            setFetchingState("finished")
        }
        refreshPage();  
    }, []);

    //when player info changes, refresh the selected info
    useEffect(()=>{
        console.log(playerInfo)
        if(!playerInfo){
            return
        }
        if(!selectedInfo){
            setSelectedInfo(playerInfo.hsrInfo[0])
            return
        }
        const current_uid = selectedInfo.uid;
        const index = playerInfo.hsrInfo.findIndex(info=>info.uid === current_uid)
        if(index === -1){
            const info = playerInfo.hsrInfo[0];
            setSelectedInfo(info);
        }else{
            setSelectedInfo(playerInfo.hsrInfo[index]);
        }
    },[playerInfo])

    // set the selected relic once the filter or selected UID changes
    useEffect(()=>{
        if(selectedInfo){
            let relics = selectedInfo.relics;
            if(filterType){
                relics = relics.filter(relic => relic.type === filterType)
            }
            setSelectedRelicList(relics)
        }
        //console.log(selectedInfo,filterType)
    },[selectedInfo,filterType])


    //set Selected Relic
    useEffect(()=>{
        if(selectedRelicList && selectedRelicList[0]){
            setSelectedRelic(selectedRelicList[0])
        }else{
            setSelectedRelic(null)
        }
    },[selectedRelicList])

    //fetch the new player info

    if(fetchingState=="loading"){
        return(
            <div className="body">
                <LoadingPage/>
            </div>
        )
    }
    const components:ReactElement[] = []
    components.push(
        <Searchbox loadingState={fetchingState} setLoadingState={setFetchingState} toDos={[updateBackPack, refreshPage]}/>
    )
    
    if(playerInfo && playerInfo.hsrInfo){
        components.push(
            <UIDBars selectedInfo={selectedInfo} setSelectedInfo={setSelectedInfo} infos={playerInfo.hsrInfo}/>
        )
    }
    if(selectedRelicList){
        components.push(
            <div className='flex flex-row'>
                <div className='flex flex-col w-full'>
                    <FilterArea filter={filterType} setFilter={setFilterType}/>
                    <div className='grid grid-cols-5'>
                        {selectedRelicList.map((relic,index)=>
                            <RelicIcon relic={relic} clicked={setSelectedRelic} key={index}/>
                        )}
                        <NewRelic clicked={()=>setSelectedRelic(null)}/>
                    </div>
                </div>
                
                <div className='flex w-full flex-col items-center'>
                    <RelicView relic={selectedRelic} account={selectedInfo}/>
                </div>
            </div>
        )
    }   
    
    return(
        <div className='body'>
            {components}
        </div>
    )

}

interface RelicIconProps {
    relic: RelicBriefInterface;
    clicked: React.Dispatch<React.SetStateAction<RelicBriefInterface | null>>;
}

function RelicIcon({relic,clicked}:RelicIconProps){
    return(
        <div onClick = {()=>clicked(relic)}>
           <RelicInstanceIcon relic={relic}/>
        </div>
    )
}

function NewRelic({clicked}:{clicked:(evt: React.MouseEvent<HTMLDivElement>) => void}){
    return(
        <div onClick={clicked}>
            <div>
                <img />
                <p>New Relic</p>
            </div>
        </div>
    )
}

interface FilterAreaProps {
    filter: RelicType|null;
    setFilter: React.Dispatch<React.SetStateAction<RelicType | null>>;
}

function FilterArea({filter, setFilter}:FilterAreaProps){
    const relic_types:RelicType[] = ["HEAD", "HAND", "BODY", "FOOT"]
    const ornament_types:RelicType[] = ["NECK", "OBJECT"]
    return(
        <div className='flex flex-row w-full justify-around gap-4'>
            <div className='flex flex-row justify-around grow border-b border-secondary'>
            {  
                relic_types.map(type=>(
                    <FilterButton value={type} state={filter} setState={setFilter} allowDeselect={true}>
                        <div >
                            <img src={`/starrail/Relic Types/${parseType(type)}.webp`} alt={type} />
                        </div>
                    </FilterButton>
                ))
            }
            </div>
            <div className='flex flex-row justify-around grow border-b border-secondary'>
            {  
                ornament_types.map(type=>(
                    <FilterButton value={type}state={filter} setState={setFilter} allowDeselect={true}>
                        <div>
                            <img src={`/starrail/Relic Types/${parseType(type)}.webp`} alt={type} />
                        </div>
                    </FilterButton>
                ))
            }
            </div>
        </div>
    )
}

interface RelicViewProps {
    relic: RelicBriefInterface|null;
    account: HsrInfoInterface|null;
}

function RelicView({relic,account}:RelicViewProps){
    if(!relic){
        return <></>
    }
    
    return <RelicDetail relic={relic} account={account}/>
}



/*
interface RelicAddProps{
    account:HsrInfoInterface|null;
}
function RelicAdd({account}:RelicAddProps){
    const [message, setMessage] = useState(undefined);
    const [loading, setLoading] = useState(false);

    function preCheck(data:{level:number, main_value:number}){
        const {level,main_value} = data;
        console.log(Math.floor(level))
        if(Math.floor(level) != level || level>15 || level < 1){
            return "Invalid Level"
        }
        if(!main_value){
            return "Invalid Main Stat Value"
        }
        for(let index =0;index<4;index++){
            if(data[`sub_${index}_type`] && ! data[`sub_${index}_value`]){
                return "Invalid Sub Stat Value"
            }
        }
        return true
    }

    async function submitButtonClicked(evt){
        evt.preventDefault()

        setLoading(true)
        if(loading){
            console.log("Fast Return")
            return;
        }
        const result = await handleSubmit({evt,path:"manualAddToDataBase",redirect:false, additionalInfo:account, preCheck})
        
        //handleSubmit successfully
        if(result == true){
            await refreshPage()
            setMessage(undefined)
        }else{
            setMessage(result)
        }
        setLoading(false);
    }

    
    const submitButton = 
            <input type="submit" />
        return(
            <>
                <AddRelicDetail additionalComponents = {[submitButton]} submitAction = {submitButtonClicked}/>
                <p>{message}</p>
            </>
        )
}

*/


interface RelicDetailProps{
    relic:RelicBriefInterface
    account:HsrInfoInterface|null
}

function RelicDetail({relic,account}:RelicDetailProps){
    const [loading,setLoading] = useState(false)
    async function deleteButtonClicked(relic:RelicBriefInterface,account:HsrInfoInterface|null){
        if(loading){
            //console.log("Fast return")
            return
        }
        setLoading(true)

        //console.log(account)
        const response = await fetch(`/api/deleteBackPackRelic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({relic,account}),
        });
        await refreshPage();

        setLoading(false);
    }

    return(
        <div>
            <RelicViewBox relic={relic}/>
            <button onClick={() => deleteButtonClicked(relic,account)}>Delete</button>
        </div>
    )
}



async function updateBackPack(data:UserInfo){
    const response = await fetch(`/api/userInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userInfo:data}),
    });
}