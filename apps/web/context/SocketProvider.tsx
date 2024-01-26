// Import necessary dependencies from React and "socket.io-client"
"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

// Define the props for the SocketProvider component
interface SocketProviderProps {
  children?: React.ReactNode;
}

// Define the shape of the context to be used by components
interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages: string[];
  socket: Socket;
}

// Create a context with an initial value of null
const SocketContext = React.createContext<ISocketContext | null>(null);

// Custom hook to access the socket context
export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
};

// SocketProvider component to manage WebSocket connection and messages
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  // State variables for the WebSocket connection and messages
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<String[]>([]);
  // Function to send a message to the server
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("send message", msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );

  // Function to handle messages received from the server
  const onMessageReceived = useCallback((msg: string) => {
    console.log("from server message received", msg);
    const m = JSON.parse(msg);
    setMessages((prev) => [...prev, m]);
  }, []);

  // Set up the WebSocket connection when the component mounts
  useEffect(() => {
    // Create a new socket connection
    const _socket = io("http://localhost:8000");

    // Set up an event listener for "message" events
    _socket.on("message", onMessageReceived);

    // Update the state with the socket connection
    setSocket(_socket);

    // Clean up the connection when the component unmounts
    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageReceived);
      setSocket(undefined);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  // Provide the socket-related functionality through context
  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
