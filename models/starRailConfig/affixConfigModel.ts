import { Schema, model, models } from 'mongoose';
import {ConfigConnection} from '../../utils/ConnectDatabase';
const AffixConfigSchema = new Schema({
    
}); 



const StarRailDB = ConfigConnection;

const Affix_config = StarRailDB.models?.affix_config || StarRailDB.model('affix_config', AffixConfigSchema);

export default Affix_config