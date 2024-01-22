const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const path = require("path")

const port = 8080
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, 'page')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'page/index.html'));
});

io.on('connection', (socket) => {
    /*connect*/
    ip = socket.handshake.address
    console.log('ID: ' + socket.handshake.address + ' connected');
    socket.on('disconnect', () => {
        console.log('ID: ' + socket.handshake.address + ' disconnected');
    });

    /*client msg*/
    io.emit('new user', socket.id)
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg)
    });
    
});



server.listen(port, () => {
    console.log(`server running at port ${port} ...`);
});