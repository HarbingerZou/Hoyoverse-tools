import { UserInfo } from "./JSONStructureOwn";
import parser from "../../utils/starrail/parseAPIInfo";
export default async function handler(req:any, res:any) {
    const UID = req.query.uid
    const userInfo:UserInfo|null = await parser(UID)
    if(userInfo == null){
        return res.status(500).json({Error:"Temporary error fetching user infos"})
    }else{
        return res.status(200).json(userInfo)
    }
}