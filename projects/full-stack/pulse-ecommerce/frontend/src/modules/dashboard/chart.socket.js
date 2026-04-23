import { socket } from "../../core/socket";

export const listenChart = (callback) => {
  socket.on("chart_update", callback);
};
