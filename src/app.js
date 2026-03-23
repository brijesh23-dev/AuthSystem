const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(morgan("dev"));
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", userRoutes);
module.exports = app;
