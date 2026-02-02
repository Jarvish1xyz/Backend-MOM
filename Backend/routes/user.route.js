const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/updateProfile");
const { getMyProfile, updateProfile, updateMyMeetings, updateStarredMeetings, deleteStarredMeetings } = require("../controllers/user.controller");

router.get("/profile", auth, getMyProfile);
router.put("/profile/update", auth, upload.single("profileImg"), updateProfile);
router.patch("/meeting/update/",auth, updateMyMeetings);
router.patch("/meeting/starred/",auth, updateStarredMeetings);
router.put("/meeting/starred/",auth, deleteStarredMeetings);

module.exports = router;