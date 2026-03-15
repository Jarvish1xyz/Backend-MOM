const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { googleLoginTrigger } = require("../controllers/google.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/google/login", googleLoginTrigger);

module.exports = router;