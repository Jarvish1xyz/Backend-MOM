const Meeting = require("../models/Meeting");
const User = require("../models/User");

// 🔹 GET MY PROFILE
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// 🔹 UPDATE MY PROFILE
exports.updateMyProfile = async (req, res) => {
  try {
    const { phone, profileImg, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { phone, profileImg, role },
      { new: true }
    ).select("-password");

    res.json({
      msg: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.updateMyMeetings = async (req, res) => {
  try {
    const { email, meetingid } = req.body;
    console.log(req.body);
    
    const meeting = await Meeting.findOne({ meetingid: meetingid });
    console.log(meeting);

    const user = await User.findOneAndUpdate(
      { email: email },
      { $push: { meetings: meeting._id } },
      { new: true }
    );
    console.log(user);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}