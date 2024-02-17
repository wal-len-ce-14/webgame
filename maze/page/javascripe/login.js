// setup
const socket = io();

const map = document.getElementById('map');
var posx, posy;
var upyet = true
var blockrow = 17, blockcol = 25
var ID = 0


for(var i = 0; i < blockrow; i++){
    for(var j = 0; j < blockcol; j++){
        const block = document.createElement('div')
        // if(Math.random() > 0.3){
        //     block.className = "block"
        // }else{
        //     block.className = "blockage"
        // }
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
    block.classList.add('initblock')
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
        
        switch(key){
            case 'ArrowUp':
                var block = document.getElementById(`block_${posx}_${posy-1}`)
                if(block.className != "blockage") socket.emit('keypress', key, posx, posy)
                break;
            case 'ArrowDown':
                var block = document.getElementById(`block_${posx}_${posy+1}`)
                if(block.className != "blockage") socket.emit('keypress', key, posx, posy)
                break;
            case 'ArrowLeft':
                var block = document.getElementById(`block_${posx-1}_${posy}`)
                if(block.className != "blockage") socket.emit('keypress', key, posx, posy)
                break;
            case 'ArrowRight':
                var block = document.getElementById(`block_${posx+1}_${posy}`)
                if(block.className != "blockage") socket.emit('keypress', key, posx, posy)
                break;
            case "a":
                socket.emit('keypress', key, posx, posy)
                break;
            case "s":
                socket.emit('keypress', key, posx, posy)
                break;
            case "d":
                socket.emit('keypress', key, posx, posy)
                break;
            case "f":
                socket.emit('keypress', key, posx, posy)
                break;
            default:
                break;
        }
        
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
                    player.style.left = "0.45rem"
                    otherplayer.style.right = "0.45rem"
                }else{
                    player.style.left = ''
                }
                block.appendChild(otherplayer)  
            }
            
        });
    }
})

socket.on("col_att", (px, py)=>{
    for(var i = 0; i < blockrow; i++){
        if(i != py){
            const block = document.getElementById(`block_${px}_${i}`)
            orinbackgroundColor = "rgb(159, 159, 159)"
            orinborder = "1px black solid"
            block.style.backgroundColor = "white"
            setTimeout(()=>{
                block.style.backgroundColor = "black"
                block.style.border = "5px solid white"
            }, 500)
            setTimeout(()=>{
                block.style.backgroundColor = orinbackgroundColor
                block.style.border = orinborder
            }, 1000);
        }
    }
})

socket.on("row_att", (px, py)=>{
    for(var i = 0; i < blockcol; i++){
        if(i != px){
            const block = document.getElementById(`block_${i}_${py}`)
            orinbackgroundColor = "rgb(159, 159, 159)"
            orinborder = "1px black solid"
            block.style.backgroundColor = "white"
            setTimeout(()=>{
                block.style.backgroundColor = "black"
                block.style.border = "5px solid white"
            }, 500)
            setTimeout(()=>{
                block.style.backgroundColor = orinbackgroundColor
                block.style.border = orinborder
            }, 1000);
        }
    }
})