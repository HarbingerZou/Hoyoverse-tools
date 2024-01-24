import { Schema, model, models } from 'mongoose';
import conn from '../../utils/ConnectStarRailConfig';

const AvatarConfigSchema = new Schema({
    id:Number,
    name:String,
    element:String,
    path:Number,
}); 

const StarRailDB = conn;

const Avatar_config = StarRailDB.models?.avatar_config || StarRailDB.model('avatar_config', AvatarConfigSchema);

export default Avatar_config