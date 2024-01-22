const Mongo = require('mongodb').MongoClient;
const connectionmongo = 'mongodb://127.0.0.1:27017/myapp';

const client = new Mongo(connectionmongo)
async function connect(){
    try{
        await client.connect()
        console.log("db is connect...")
    }catch(e){
        console.log("Error: "+e)
    }
}
connect()

async function createplayer(ID) {
    const position = client.db().collection('position');
    const info = {id: ID, x: 9, y: 6};
    await position.insertOne(info);
    // console.log('add player '+ID)
}

async function getposition(ID) {
    const position = client.db().collection('position');
    const info = await position.find({id: ID}).toArray();
    return info[0]
}

async function getallposition(ID){
    const position = client.db().collection('position');
    const info = await position.find({id: {$ne: ID}}).toArray();
    return info
}

async function updateposition(ID, newx, newy) {
    const position = client.db().collection('position');
    const update = {$set: {x: newx, y: newy}};
    await position.updateOne({id: ID}, update);
}

async function deleteplayer(ID) {
    const position = client.db().collection('position');
    await position.deleteMany({id: ID});
    console.log('delete player '+ID)
}

async function clearposition(){
    const position = client.db().collection('position');
    await position.deleteMany({});
    console.log('clear/init db')
}

module.exports = {
    createplayer,
    deleteplayer,
    getposition,
    updateposition,
    clearposition,
    getallposition
}

// deleteplayer('qNByaY1neKtmFh47AAAB')
