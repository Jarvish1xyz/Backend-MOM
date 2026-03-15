const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { googleLoginTrigger, googleLoginCallback, googleRegisterCallback, googleRegisterTrigger, authGoogle, authGoogleCallback } = require("../controllers/google.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/google/login", googleLoginTrigger);
router.get("/google/register", googleRegisterTrigger);
router.get("/google/login/callback", googleLoginCallback);
router.get("/google/register/callback", googleRegisterCallback);
router.get("/google", authGoogle);
router.get("/google/callback", authGoogleCallback);

module.exports = router;