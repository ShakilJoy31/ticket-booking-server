require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { notFoundHandler, errorHandler } = require("./error");
const apiRoutes = require("./api.routes");
const corsOptions = require("../config/corsOptions");

// ✅ ADD THIS - Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CORS
app.use(cors(corsOptions));

app.set("view engine", "ejs");

app.get("/health", (_, res) => res.status(200).json({ message: "ok" }));

app.get("/", (req, res) => {
  res.send("Welcome to ISAB Server!");
});

app.use(apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;