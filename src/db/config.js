require("dotenv").config();
if (!process.env.MONGO_URI) {
  throw new Error("Mongo uri not defined in enviremental variables");
}
if (!process.env.JWT_SECRET) {
  throw new Error("jwt_secret not available in enviroment variables");
}
const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET:process.env.JWT_SECRET 
};
module.exports = config;
