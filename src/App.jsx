import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  const socket = useMemo(
    () =>
      io("https://chat-backend-h50y.onrender.com", {
        withCredentials: true,
      }),
    []
  );

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { room, message });
    setMessage("");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected ", socket.id);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 200 }} />
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room </h5>
        <TextField
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Join
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          label="Enter Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></TextField>
        <TextField
          id="outlined-basic"
          label="Enter Room"
          variant="outlined"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        ></TextField>
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </form>

      <Stack>
        {messages.map((message, index) => (
          <Typography key={index} variant="body2" component="div">
            {message}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
