// setup
const socket = io();

const map = document.getElementById('map');
var posx, posy;
var upyet = true
var blockrow = 13, blockcol = 19
var ID = 0

for(var i = 0; i < blockrow; i++){
    for(var j = 0; j < blockcol; j++){
        const block = document.createElement('div')
        block.className = "block"
        block.id = `block_${j}_${i}`
        map.appendChild(block)
    }
}

socket.on('init', (x, y, id)=>{
    posx = x;
    posy = y;
    // delete old
    var old = document.getElementById('player')
    if(old != null){
        old.remove()
    }   
    old = document.getElementsByClassName('otherplayer')
    if(old.length > 0){
        Array.from(old).forEach((o)=>{o.remove()})
    }

    // set client view
    const block = document.getElementById(`block_${posx}_${posy}`)
    const player = document.createElement('div')
    player.id = 'player'
    block.appendChild(player)

    ID = id
})

// move
document.addEventListener('keydown', (e)=>{
    const key = e.key;
    if (upyet){
        // console.log(key);
        socket.emit('keypress', key, posx, posy)
        upyet = false
    }
});
document.addEventListener('keyup', ()=>{
    upyet = true
})

socket.on('position', (x,y)=>{
    if(x < 0 || x >=blockcol || y < 0 || y >= blockrow);
    else{
        posx = x;
        posy = y;
        // console.log('x:',posx,'y',posy,'block',`block_${x}_${y}`)
        document.getElementById('player').remove()
        const block = document.getElementById(`block_${x}_${y}`)
        const player = document.createElement('div')
        player.id = 'player'
        block.appendChild(player)
    }
})

// other player
socket.on('other player', (p)=>{
    const player = document.getElementById("player")
    if(p.length > 0){
        const old = document.getElementsByClassName('otherplayer')
        if(old.length > 0){
            Array.from(old).forEach((o)=>{o.remove()})
        }
        p.forEach((other, idx) => {
            if(other.id != ID){
                // console.log(other,idx)
                const block = document.getElementById(`block_${other.x}_${other.y}`)
                const otherplayer = document.createElement('div')
                otherplayer.id = other.id
                otherplayer.className = "otherplayer"
                if(other.x == posx && other.y == posy){
                    player.style.left = "0.1rem"
                    otherplayer.style.right = "0.1rem"
                }
                block.appendChild(otherplayer)  
            }
            
        });
    }
})
