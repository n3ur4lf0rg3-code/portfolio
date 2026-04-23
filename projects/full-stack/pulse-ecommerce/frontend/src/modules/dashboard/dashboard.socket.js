import { socket } from "../../core/socket";

export const listenDashboard = (onNewOrder) => {
  socket.on("new_order", onNewOrder);
};
