import { Schema, model, models } from 'mongoose';
import { MainConnection } from '../utils/ConnectDatabase';
const subAffixSchema = new Schema({
    type:String,
    value:Number,
    count:Number
})

const mainAffixSchema = new Schema({
    type:String,
    value:Number
})

const relicSchema = new Schema({
    level:Number,
    type:String,
    setName:String,
    rarity:Number,
    mainAffix:mainAffixSchema,
    subAffix:[subAffixSchema]
})

const hsrInfoSchema = new Schema({
    uid:Number,
    name: String,
    level: String,
    relics: [relicSchema]
})

const UserSchema = new Schema({
    username: {type: String, required: true, minLength: 3, maxLength: 20},
    password: {type: String, required: true, minLength: 8},
    email: {type: String, required: true},
    hsrInfo: [hsrInfoSchema],
    signUpTime: Date
});

const User = MainConnection.models?.User || MainConnection.model('User', UserSchema);

export default User;

  