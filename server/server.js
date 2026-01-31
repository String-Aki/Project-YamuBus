import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/database.js";

import "./config/firebaseAdmin.js";
import fleetManagerRoutes from "./routes/fleetManagerRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import router from "./routes/routeRoutes.js";
import publicBusRoutes from "./routes/publicBusRoutes.js";

dotenv.config();
connectDB();
const app = express();

let activeFleet = {};

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bus Tracking App Is Running");
});

app.use("/api/fleetmanagers", fleetManagerRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/routes", router);
app.use("/api/buses", publicBusRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const currentBuses = Object.values(activeFleet);
  if (currentBuses.length > 0) {
    socket.emit("initialFleetState", currentBuses);
  }

  socket.on("driverLocation", (data) => {
    const busData = {
      ...data,
      lastUpdated: Date.now(),
    };

    activeFleet[data.busId] = busData;
    io.emit("busUpdate", data);
  });

  socket.on("tripEnded", (busId) => {
    delete activeFleet[busId];
    io.emit("busOffline", { busId });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
