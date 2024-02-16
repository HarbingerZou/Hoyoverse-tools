import getWeights from "../../utils/starrail/getWeight";
export default async function(req, res){
    const input = req.body
    const {name} = input
    const weight = await getWeights(name);
    res.status(200).json({weight});
}