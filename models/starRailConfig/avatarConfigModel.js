import { Schema, model, models } from 'mongoose';
import conn from '../../utils/ConnectStarRailConfig';

const multiplierSchema = new Schema({
    category:{type:String, enum:["boostMultiplier","defReduction", "resMultiplier", "vulnerabilityMultiplier"]},
    value:Number
})

const skilLevelStats = new Schema({
    damage_ratio:{type:Number, required:true},
    multipliers:[multiplierSchema]
})
const damageSchema = new Schema({
    name:String,
    type:{type:String, enum:["ATK", "DEF", "HP"]},
    target_count:Number,
    stats:{
        type:[{type:skilLevelStats}],
        validate:{
            validator: function(array){
                return array.length === 7 || array.length === 12 
            }
        }
    },
})


const AvatarConfigSchema = new Schema({
    id:Number,
    name:String,
    element:String,
    path:Number,
    damages:[damageSchema]
}); 

const StarRailDB = conn;

const Avatar_config = StarRailDB.models?.avatar_config || StarRailDB.model('avatar_config', AvatarConfigSchema);

export default Avatar_config