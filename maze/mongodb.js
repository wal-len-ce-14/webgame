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
    const info = {id: ID, x: 12, y: 8, skill: {col: 0, row: 0, around: 0, wave: 0}};
    await position.insertOne(info);
    // console.log('add player '+ID)
}

async function getposition(ID) {
    const position = client.db().collection('position');
    const info = await position.find({id: ID}).toArray();
    console.log(info[0].skill)
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

async function update_skill(ID, col, row, around, wave){
    const skill = getallposition(ID).skill
    const position = client.db().collection('position');
    await position.updateOne({id: ID}, {$set: {skill: { col: skill.col+col, 
                                                        row: skill.row+row, 
                                                        around: skill.around+around, 
                                                        wave: skill.wave+wave }}});
}

module.exports = {
    createplayer,
    deleteplayer,
    getposition,
    updateposition,
    clearposition,
    getallposition,
    update_skill
}

// deleteplayer('qNByaY1neKtmFh47AAAB')
