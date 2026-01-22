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
import routeRoutes from "./routes/routeRoutes.js";

dotenv.config();
connectDB();
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Bus Tracking App Is Running");
});

app.use("/api/fleetmanagers", fleetManagerRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/routes", routeRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('driverLocation', (data) => {
    io.emit('busUpdate', data);    
    console.log(`Bus ${data.busPlate} moved to ${data.lat}, ${data.lng}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
