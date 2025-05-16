import express from "express";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoute";

dotenv.config();

const app = express();

app.use(express.json());

//it will use as a middleware to parse the request body

app.use("/api", userRoutes);

export default app;
