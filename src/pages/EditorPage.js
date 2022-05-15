import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ACTIONS from "../actions";
import MainEditor from "../components/MainEditor";
import { initSocket } from "../socket";

function EditorPage() {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const params = useParams();
  const reactNavigation = useNavigate();

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connection_error", (err) => handleErrors(err));
      socketRef.current.on("connection_failed", (err) => handleErrors(err));
      const handleErrors = (err) => {
        toast.error("Socket connection failed, try again later.");
        reactNavigation("/");
      };
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: params.id,
        username: location.state?.username,
      });
      //
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
          }

          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, []);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(params.id);
      toast.success("Room Id copied to clipboard");
    } catch (error) {
      toast.error("Please try again.");
    }
  };

  const handleLeaveRoom = () => {
    reactNavigation("/");
  };
  const handleCodeChange = (code) => {
    codeRef.current = code;
  };


  return (
    <div>
      <div
        style={{ backgroundColor: "#4A5459", padding: "0px 10px" }}
        className="aside"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{color:'#ffffff'}}>Code Share</h3>
          </div>
          <div style={{ display: "flex" }}>
            {clients.map((client, i) => {
              return (
                <div style={{ margin: "0px 10px" }} key={client.socketId}>
                  <Avatar size="30" name={client.username} />
                </div>
              );
            })}
          </div>
          <div>
            <button
              style={{
                margin: "0px 5px",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleCopyRoomId}
            >
              Copy Room ID
            </button>
            <button
              style={{
                margin: "0px 5px",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleLeaveRoom}
            >
              Leave
            </button>
          </div>
        </div>
      </div>

      <div>
        <MainEditor
          socketRef={socketRef}
          onCodeChange={handleCodeChange}
          roomId={params.id}
        />
      </div>
    </div>
  );
}

export default EditorPage;
