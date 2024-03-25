import getWeights from "../../utils/starrail/getWeight";
import { NextApiRequest, NextApiResponse } from "next";
export default async function(req:NextApiRequest, res:NextApiResponse){
    const input = req.body
    const {name} = input
    const weight = await getWeights(name);
    res.status(200).json({weight});
}