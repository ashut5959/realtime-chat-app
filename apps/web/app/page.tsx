"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
  // Use the custom hook to access socket-related functionality
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div>
      <div>
        <input
          className={classes["chat-input"]}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Message..."
        />
        <button
          className={classes["button"]}
          onClick={(e) => sendMessage(message)}
        >
          Send
        </button>
      </div>
      <div>
        {messages.map((e, index) => (
          <li key={index} className={classes["list"]}>
            {e}
          </li>
        ))}
      </div>
    </div>
  );
}
