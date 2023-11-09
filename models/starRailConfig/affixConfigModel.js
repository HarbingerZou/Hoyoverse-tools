import { Schema, model, models } from 'mongoose';
import conn from '../../utils/ConnectStarRailConfig';
const AffixConfigSchema = new Schema({
    
}); 



const StarRailDB = conn;

const Affix_config = StarRailDB.models?.affix_config || StarRailDB.model('affix_config', AffixConfigSchema);

export default Affix_config