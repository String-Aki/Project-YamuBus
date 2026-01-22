import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from "./config/database.js";
import './config/firebaseAdmin.js';
import fleetManagerRoutes from './routes/fleetManagerRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import routeRoutes from './routes/routeRoutes.js';

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Bus Tracking App Is Running");
});

app.use('/api/fleetmanagers', fleetManagerRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/routes', routeRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
