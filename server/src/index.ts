import dotenv from "dotenv";
dotenv.config();
const frontend = process.env.FRONT_END;
const prod = process.env.PROD;
const PORT = process.env.PORT || 5000;

import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes";

const app = express();
app.use(
  cors({
    origin: frontend,
    credentials: prod === "true",
  })
);
app.use(express.json());

app.use("/projects/", projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
