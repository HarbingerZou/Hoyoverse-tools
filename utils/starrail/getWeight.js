import CharacterWeight from "../../models/starRailConfig/characterToStatsScore"
export default async function getWeights(name) {
    try {
        if (name) {
            const rawCharacterWeight = await CharacterWeight.findOne({name});
            const characterWeight = JSON.parse(JSON.stringify(rawCharacterWeight));
            delete characterWeight._id
            delete characterWeight.name
            return characterWeight
        }else{
            const rawCharacterWeight = await CharacterWeight.find({});
            const characterWeight = JSON.parse(JSON.stringify(rawCharacterWeight));
            //console.log(characterWeight)
            return characterWeight
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}
