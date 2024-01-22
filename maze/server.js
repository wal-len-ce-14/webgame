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
                if(posy <= 12) await mongo.updateposition(socket.id, posx, posy+1)
                break;
            case 'ArrowLeft':
                if(posx > 0) await mongo.updateposition(socket.id, posx-1, posy)
                break;
            case 'ArrowRight':
                if(posx <= 18) await mongo.updateposition(socket.id, posx+1, posy)
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
});

server.listen(port, () => {
    console.log(`server running at port ${port} ...`);
});
})
