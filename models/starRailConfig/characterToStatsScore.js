import { Schema, model, models } from 'mongoose';
import conn from '../../utils/ConnectStarRailConfig';

const WeightSchema = new Schema({
  //icon_path:String
  name:String,
  HP:Number,
  ATK:Number,
  DEF:Number,
  Speed:Number,
  "CRIT Rate":Number,
  "CRIT DMG":Number,
  "Break Effect":Number,
  "Outgoing Healing":Number,
  "Energy Regeneration Rate":Number,
  "Effect HIT Rate":Number,
  "Effect RES":Number
});

const StarRailDB = conn;

const CharacterWeight = StarRailDB.models?.Character_to_stats_score || StarRailDB.model('Character_to_stats_score', WeightSchema);

export default CharacterWeight