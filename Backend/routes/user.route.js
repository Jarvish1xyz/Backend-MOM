const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getMyProfile, updateMyProfile, updateMyMeetings } = require("../controllers/user.controller");

router.get("/profile", auth, getMyProfile);
router.put("/profile/update", auth, updateMyProfile);
router.patch("/meeting/update/", updateMyMeetings)

module.exports = router;