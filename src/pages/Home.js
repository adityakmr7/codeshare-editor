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
    toast.success("Created a new Room");
  };
  const handleJoinRoom = () => {
    if (!roomId || !username) {
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor:'#4C4A48'
      }}
    >
      <div
        style={{
          backgroundColor: "#767676",
          padding: "20px 40px",
          flexDirection: "column",
          display: "flex",
        }}
      >
        <input
          style={{
            margin: '10px 0px',
            padding: '5px 10px',
            border:'none',
            
          }}
          onChange={(e) => setRoomId(e.target.value)}
          value={roomId}
          type="text"
          className=""
          placeholder="Enter Room ID"
        />

        <input
        style={{
          margin: '10px 0px',
          padding: '5px 10px',
          border:'none'
        }}
          value={username}
          onChange={(e) => setusername(e.target.value)}
          type="text"
          placeholder="Enter Username"
        />
        <button style={{
          margin:'10px 0px',
          padding: '10px 5px',
          cursor:'pointer'
        }} onClick={handleJoinRoom}>Join Room</button>
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
