const express = require("express");
const router = express.Router();
const controllers = require("../controllers/auth.controller");

router.post("/register",controllers.Register)
router.post("/login",controllers.Login)
router.get("/getme",controllers.getme)
router.post("/refresh-Token",controllers.refreshToken)
module.exports = router;