const express = require("express");
const router = express.Router();
const controllers = require("../controllers/auth.controller");
const { validateUser } = require("../middleware/user.validatio");

router.post("/register", validateUser, controllers.Register);
router.post("/login", controllers.Login);
router.get("/getme", controllers.getme);
router.post("/refresh-Token", controllers.refreshToken);
router.get("/logout", controllers.logout);
module.exports = router;
