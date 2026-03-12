import express from "express";

import connectDB from "./db/db.js";
import formRoutes from "./routes/Form.js";

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/appraisals", formRoutes);

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
