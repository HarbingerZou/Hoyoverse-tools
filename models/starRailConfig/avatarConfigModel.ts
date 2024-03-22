import { Schema, model, models } from 'mongoose';
import {ConfigConnection} from '../../utils/ConnectDatabase';

const AvatarConfigSchema = new Schema({
    id:Number,
    name:String,
    element:String,
    path:Number,
}); 

const StarRailDB = ConfigConnection;

const Avatar_config = StarRailDB.models?.avatar_config || StarRailDB.model('avatar_config', AvatarConfigSchema);

export default Avatar_config