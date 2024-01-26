import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "redis-2404c221-ashutoshpal59-18bb.a.aivencloud.com",
  port: 18056,
  username: "default",
  password: "AVNS_IRT6a03s8d1_NGsa1dY",
});
const sub = new Redis({
  host: "redis-2404c221-ashutoshpal59-18bb.a.aivencloud.com",
  port: 18056,
  username: "default",
  password: "AVNS_IRT6a03s8d1_NGsa1dY",
});

class SockerService {
  private _io: Server;
  constructor() {
    console.log("Initialize Socket ");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    io.on("connect", (socket) => {
      console.log(`New Socker Connected`, socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Received", message);
        await pub.publish("MESSAGES", JSON.stringify(message));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }
  get io() {
    return this._io;
  }
}

export default SockerService;
