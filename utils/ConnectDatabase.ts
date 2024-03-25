import mongoose from "mongoose";

/*
export default async function connectToStarRail() {
    const conn =  mongoose.createConnection("mongodb+srv://zoujiajie20010606:66712001zjj66zjj@harbingerzou.vmlx3pz.mongodb.net/star_rail?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    //const value = await connectToDb(), value is the parameter of resolve
    return new Promise((resolve, reject) => {
        conn.on('connected', () => {
            console.log('Connected to Star Rail!');
            resolve(conn);
        });

        conn.on('error', (err) => {
            console.error('Error connecting to Star Rail:', err);
            reject(err);
        });
    });
}
*/

const ConfigConnection =  mongoose.createConnection(process.env.Config_URI!) 

const MainConnection =  mongoose.createConnection(process.env.Main_URI!);
export {ConfigConnection, MainConnection}