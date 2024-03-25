import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth'; 
import User from '../../models/userModel'; 
import { authOptions } from './auth/[...nextauth]';
import { HsrInfoInterface, RelicBriefInterface, RelicMongoInterface, UserInterface } from '../../utils/starrail/SharedTypes';
import { FormattedRelic, UserInfo } from './JSONStructureOwn';

export default async function(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: "No session" }); // 401 Unauthorized might be more appropriate
    }

    const session_user = session.user;
    if (!session_user) {
        return res.status(401).json({ message: "No user in session" }); // 401 Unauthorized might be more appropriate
    }
    const session_user_email = session_user.email;
    if (!session_user_email) {
        return res.status(404).json({ message: "User email not found" }); // 404 Not Found, if email is expected but not present
    }

    if (req.method === 'GET') {
        //console.log("GET")
        await methodGet(req, res, session_user_email)

    } else if (req.method === 'POST') {
        await methodPost(req, res, session_user_email)
    } else if (req.method === "DELETE"){
        await methodDelete(req, res, session_user_email)
    }else{
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}

async function methodGet(req:NextApiRequest, res:NextApiResponse, session_user_email:String){
    try {
        const db_user = await User.findOne({ email: session_user_email });
        //console.log(db_user)

        if (!db_user) {
            return res.status(404).json({ message: "Invalid User" });
        }

        // Modify this response as needed for a GET request
        return res.status(200).json({ message: "Success", user: db_user });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function methodPost(req:NextApiRequest, res:NextApiResponse, session_user_email:string) {
        try {
            const updatedUser = await User.findOne({ email: session_user_email });
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found for update" });
            }

            //allow post with a whole user info or a single relic
            const {userInfo, relic}:{userInfo:UserInfo, relic:RelicBriefInterface} = req.body

            if(userInfo){
                //console.log("update with userinfo")
                await updateWithUserInfo(updatedUser, userInfo)
            }
            if(relic){
                await updateWithRelic(session_user_email, updatedUser, relic)
            }

            try{
                await updatedUser.save();
            }catch(err){
                return res.status(404).json({ message: "User Saving error" });      
            }

            return res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            console.error("Update error:", error);
            return res.status(500).json({ message: "Internal Server Error on update" });
        }
}

async function updateWithUserInfo(updatedUser:UserInterface, userInfo:UserInfo) {
    if(!updatedUser.hsrInfo){
        updatedUser.hsrInfo = []
    }

    let current_hsrInfos = updatedUser.hsrInfo;
    const old_hsr_info = current_hsrInfos.find((hsrInfo) => hsrInfo.uid === userInfo.uid)

    const relicSets = new Set<string>()
    const new_hsr_info: HsrInfoInterface = {uid:userInfo.uid, level:userInfo.level, name:userInfo.name, relics:[]}
    
    for(const avatar of userInfo.avatars){
        for(const relic of avatar.relics){
            const {setID, ...relicBrief} = relic
            console.log(relicBrief) 
            relicSets.add(JSON.stringify(relicBrief))
        }
    }
    //console.log(relicSets.size)
    
    if(old_hsr_info===undefined){
        new_hsr_info.relics = [...relicSets].map(relicString => JSON.parse(relicString))
        current_hsrInfos.push(new_hsr_info);
        return
    }
    
    
    for(const relic of old_hsr_info.relics){
        const plainRelic = JSON.parse(JSON.stringify(relic))
        delete plainRelic._id
        delete plainRelic.mainAffix._id
        for(const subAffix of plainRelic.subAffix){
            delete subAffix._id
        }
        //console.log(plainRelic)
        relicSets.add(JSON.stringify(plainRelic))
    }
    //console.log(relicSets.size)

    //compare by pointer
    current_hsrInfos = current_hsrInfos.filter(info => info !== old_hsr_info)

    new_hsr_info.relics = [...relicSets].map(relicString => JSON.parse(relicString))
    //console.log(new_hsr_info.relics.length)
    //console.log(new_hsr_info.relics)
    current_hsrInfos.push(new_hsr_info);
    updatedUser.hsrInfo = current_hsrInfos
}


async function updateWithRelic(session_user_email:string, updatedUser:UserInterface, relic:RelicMongoInterface) {
    
}


async function methodDelete(req:NextApiRequest, res:NextApiResponse, session_user_email:String){
    try {
        const db_user = await User.findOne({ email: session_user_email });
        //console.log(db_user)

        if (!db_user) {
            return res.status(404).json({ message: "Invalid User" });
        }
        
        const {hsrInfo, relic}:{hsrInfo:HsrInfoInterface, relic:RelicBriefInterface} = req.body

        if(relic){
            //console.log("update with userinfo")
            await deleteRelic(db_user, hsrInfo, relic)
        }

        try{
            await db_user.save();
        }catch(err){
            return res.status(404).json({ message: "User Saving error" });      
        }

        return res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


async function deleteRelic(db_user:UserInterface, hsrInfo:HsrInfoInterface, relic:RelicMongoInterface) {
    const db_user_hsr_info = db_user.hsrInfo.find(info=>info.uid === hsrInfo.uid)
    if(db_user_hsr_info === undefined){
        console.log("No HSR Info Found")
        return
    }
    const index = db_user_hsr_info.relics.findIndex(relicInstance => JSON.parse(JSON.stringify(relicInstance._id)) === relic._id)
    //console.log(relic)

    if(index>=0){
        db_user_hsr_info.relics.splice(index,1);
    }else{
        //console.log("No Relic Found")
        return
    }
}