import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setusername] = useState("");
  const navigate = useNavigate();
  const handleCreateNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new Room');
  };
  const handleJoinRoom = () => {
    if(!roomId || !username) {
      return
    }
    navigate(`/editor/${roomId}`,{
        state:{
            username
        }
    })
  };
  
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "block" }}>
        <input
          onChange={(e) => setRoomId(e.target.value)}
          value={roomId}
          type="text"
          className=""
          placeholder="Enter RoomID"
        />
        <input
          value={username}
          onChange={(e) => setusername(e.target.value)}
          type="text"
          placeholder="Enter user name"
        />
        <button onClick={handleJoinRoom}>Join Room</button>
        <div>
          <p>If you don't have an invite then create</p>
          <span>
            <a onClick={handleCreateNewRoom} href="">
              Create new Room
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;
