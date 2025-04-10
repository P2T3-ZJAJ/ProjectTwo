const forceDatabaseRefresh = false;

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/connection.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

// get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// define the path to client files
const clientPath = path.join(__dirname, "../../client/dist");
console.log("Looking for client files at:", clientPath);

// serves static files in the entire client's dist folder
app.use(express.static(clientPath));

app.use(express.json());
app.use(routes);

// add the catch-all route AFTER other routes but BEFORE starting the server
app.get("*", (_req, res) => {
  console.log("Serving index.html from:", path.join(clientPath, "index.html"));
  res.sendFile(path.join(clientPath, "index.html"));
});

sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
