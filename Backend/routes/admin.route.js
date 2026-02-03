const express = require("express");
const AdminRoute = express.Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/updateProfile");
const { getMyProfile, updateProfile } = require("../controllers/user.controller");
const { getAllUsers } = require("../controllers/admin.controller");

AdminRoute.get("/profile", auth, getMyProfile);
AdminRoute.put("/profile/update", auth, upload.single("profileImg"), updateProfile);
AdminRoute.get("/all-users", auth, getAllUsers);


module.exports = AdminRoute;