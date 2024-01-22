const socket = io();

const form = document.getElementById('sayform');
const input = document.getElementById('sayinput');
const msg = document.getElementById('msg')


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
}) 

socket.on('new user', (id)=>{

  function pad(number) {
    return (number < 10 ? '0' : '') + number;
  }

  var currentDate = new Date();
  const newusermsg = document.createElement('p');
  newusermsg.id = 'newusermsg'
  newusermsg.innerHTML = pad(currentDate.getMonth()+1)+'/'
                          +pad(currentDate.getDate())+' '
                          +pad(currentDate.getHours())+':'
                          +pad(currentDate.getMinutes())+' <br>'
                          +id+' join in'
  msg.appendChild(newusermsg)
  console.log(currentDate)
  msg.scrollTop = msg.scrollHeight
})

socket.on('chat message', (m) => {
  const item = document.createElement('p');
  item.textContent = '- ' + m;
  msg.appendChild(item);
  msg.scrollTop = msg.scrollHeight
});