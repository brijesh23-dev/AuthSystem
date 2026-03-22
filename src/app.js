const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(morgan("dev"));
const userRoutes = require("./routes/user.routes");

app.use(express.json());
app.use("/api/auth", userRoutes);
module.exports = app;
