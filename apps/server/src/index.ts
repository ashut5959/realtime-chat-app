import http from "http";
import SockerService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";
async function init() {
  startMessageConsumer();
  const socketService = new SockerService();
  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
  socketService.initListeners();
}

init();
