import {ConfigConnection} from '../../utils/ConnectDatabase';
import { Schema, model, models } from 'mongoose';

const SetConfigSchema = new Schema({
    
}); 

const StarRailDB = ConfigConnection;

const Set_config = StarRailDB.models?.set_config || StarRailDB.model('set_config', SetConfigSchema);

export default Set_config