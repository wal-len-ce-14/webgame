const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const path = require("path")
const router = require("./router/login")
const mongo = require("./mongodb")

const port = 8080
const app = express()
const server = http.createServer(app)
const io = new Server(server)


app.use(express.static(path.join(__dirname, 'page')));
app.set('views', path.join(__dirname, "page"));
app.use('/', router)

mongo.clearposition().then(()=>{

const client = []

io.on('connection', async (socket) => {
    /* connect */
    // console.log('ID: ' + ID + ' connected');
    socket.on('disconnect', async ()=>{
        await mongo.deleteplayer(socket.id)
        mongo.getallposition().then((info)=>{
            io.emit('other player', info)
        })
    })
    

    /* db */
    await mongo.createplayer(socket.id)
    mongo.getposition(socket.id).then((r)=>{
        socket.emit('init', r.x, r.y, socket.id)
    })
    mongo.getallposition().then((info)=>{
        // console.log(socket.id, 'pos:', info)
        io.emit('other player', info)
    })

    /* client service */
    socket.on('keypress', async (key, posx, posy)=>{
        switch(key){
            case 'ArrowUp':
                if(posy > 0) await mongo.updateposition(socket.id, posx, posy-1)
                break;
            case 'ArrowDown':
                if(posy <= 17) await mongo.updateposition(socket.id, posx, posy+1)
                break;
            case 'ArrowLeft':
                if(posx > 0) await mongo.updateposition(socket.id, posx-1, posy)
                break;
            case 'ArrowRight':
                if(posx <= 25) await mongo.updateposition(socket.id, posx+1, posy)
                break;
            case 'a':
                mongo.getposition(socket.id).then((info) => {
                    // console.log("col:",info.skill.col)
                    if(info.skill.col > 0){
                        io.emit("col_att", posx, posy)
                    }
                })
                break;
            case 's':
                mongo.getposition(socket.id).then((info) => {
                    // console.log("row:",info.skill.row)
                    if(info.skill.row > 0){
                        io.emit("row_att", posx, posy)
                    }
                })
                break;
            case 'd':
                mongo.getposition(socket.id).then((info) => {
                    // console.log("around:",info.skill.around)
                })
                break;
            case 'f':
                mongo.getposition(socket.id).then((info) => {
                    // console.log("wave:",info.skill.wave)
                })
                break;
            default:
                break;
        }
        mongo.getposition(socket.id).then((r)=>{
            // console.log('pos:', r.x, r.y)
            socket.emit('position', r.x, r.y)
        })
        mongo.getallposition().then((info)=>{
            // console.log('pos:', info)
            io.emit('other player', info)
        })
    })
    socket.on("damage", async ()=>{
        await mongo.heath_update(socket.id, -1)
    })
});

server.listen(port, () => {
    console.log(`server running at port ${port} ...`);
});
})
