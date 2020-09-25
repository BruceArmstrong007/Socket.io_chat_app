const socket = io();
const chatform = document.getElementById("chatForm");
const chat = document.getElementById("chat");
const messages = document.getElementById("messages");
const roomContainer = document.getElementById("room-container");


if(chatform != null){
    const name = prompt("whats your Name?");

    postMessage(" joined","You");
    
    socket.emit('new-user',roomName,name);

    chatform.addEventListener('submit', e => {
        e.preventDefault;
        let msg = chat.value;
        socket.emit('chat-message',roomName,msg);
        postMessage("You: "+msg,true);
        chat.value = "";
        return false;
      });
}

socket.on('room-created',room =>{
    const roomElement = document.createElement('div');
    roomElement.innerText = room;
    const roomLink = document.createElement('a');
    roomlink.href = `${room}`;
    roomLink.innerText = "Join";
    roomContainer.append(roomElement);
    roomContainer.append(roomLink);
});

socket.on('chat-message',data =>{
  console.log(data.message,data.name);
  postMessage(data.name+": "+data.message,false);
});

socket.on('user-connected',msg =>{
    console.log(msg);
    postMessage(" joined",msg);
});

socket.on('user-disconnected',msg =>{
    console.log(msg);
    postMessage(" left",msg);
  });

function postMessage(msg,me){
  let li = document.createElement('p');
  let i = document.createElement('i');
 if(me === true){
     li.style.textAlign = "right";
     i.classList.add("w3-blue");
     i.innerText = msg;
 }else{
     if(me != false) {
         li.style.textAlign = "center";
         i.innerText = me+msg;
         i.classList.add("w3-medium");
         console.log(me+msg);
     }  
     i.classList.add("w3-dark-grey");
     i.innerText = msg;
 }
 i.classList.add("w3-text-white");
 i.classList.add("w3-tag");
 i.classList.add("w3-round-xlarge");
 li.classList.add("w3-padding-16");
 li.appendChild(i);
  messages.appendChild(li);
}