import './App.css';
import io from "socket.io-client";
import {useState} from "react";
import Chat from './Chat';

const socket = io.connect("https://api.lucasarts.fr/websocket/chat" , { path: '/websocket/chat/socket.io'});// transports : ['websocket'], 

function App() {

  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [showchat, setShowChat] = useState(false)

  const JoinRoom = () => {
     if(username !== "" && room !== ""){
      socket.emit('join_room', {
        room : room,
        username : username
      }); // Join the Room with ID 
      setShowChat(true);    
      //console.log(username, ' join the romm ', room)
     }
  }

  return (
    <div className="App">
      {
        !showchat ? 
        <div className='JoinContainer'>
          <h3>Join a Room</h3>
          <input type="text" placeholder="Your Pseudo" onChange={(e) => {setUsername(e.target.value)}}></input>
          <input type="text" placeholder="Room ID" id="RoomId" value={room} onChange={(e) => {setRoom(`${e.target.value}`)}}></input>
          <button onClick={JoinRoom}>Connect to room</button>
        </div>     
      
      : <Chat socket={socket} username={username} room={room}></Chat>
      }     

    </div>
  );
}

export default App;
