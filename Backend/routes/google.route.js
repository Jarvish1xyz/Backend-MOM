const express = require("express");
const router = express.Router();
const { authGoogle, authGoogleCallback } = require("../controllers/google.controller");

router.get("/auth/google", authGoogle);
router.get("/auth/google/callback", authGoogleCallback);


module.exports = router;