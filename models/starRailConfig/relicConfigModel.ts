import {ConfigConnection} from '../../utils/ConnectDatabase';
import { Schema, model, models } from 'mongoose';

const RelicConfigSchema = new Schema({
    
}); 

const StarRailDB = ConfigConnection;

const Relic_config = StarRailDB.models?.relic_config || StarRailDB.model('relic_config', RelicConfigSchema);

export default Relic_config