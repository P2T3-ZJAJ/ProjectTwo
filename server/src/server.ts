import path from 'path';
import { fileURLToPath } from 'url';

const forceDatabaseRefresh = false;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import sequelize from "./config/connection.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

const clientPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientPath));

// Serves static files in the entire client's dist folder
app.use(
  express.static(
    process.env.NODE_ENV === "production" ? "./client/dist" : "../client/dist"
  )
);

app.use(express.json());
app.use(routes);


app.get('*', (_req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
