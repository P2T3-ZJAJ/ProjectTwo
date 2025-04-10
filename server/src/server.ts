const forceDatabaseRefresh = false;

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import sequelize from "./config/connection.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Serves static files in the entire client's dist folder
app.use(
  express.static(
    process.env.NODE_ENV === "production" ? "./client/dist" : "../client/dist"
  )
);

app.use(express.json());
app.use(routes);

// catch-all route after other routes and before starting the server
// using an underscore for the unused parameter
app.get("*", (_req, res) => {
  res.sendFile("index.html", {
    root:
      process.env.NODE_ENV === "production"
        ? "./client/dist"
        : "../client/dist",
  });
});

sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
