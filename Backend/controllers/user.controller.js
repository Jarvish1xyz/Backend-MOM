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

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({userid:req.params.id}).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

// 🔹 UPDATE MY PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, username, phone, role } = req.body;
    console.log(req.body);
    console.log(req.file);
    

    const updateData = {
      name,
      username,
      phone,
      role
    };

    // 🔹 If profile image uploaded
    if (req.file) {
      updateData.profileImg = `/uploads/profile/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { phone, role } = req.body;
    console.log(req.body);
    console.log(req.file);
    

    const updateData = {
      phone,
      role
    };

    // 🔹 If profile image uploaded
    if (req.file) {
      updateData.profileImg = `/uploads/profile/${req.file.filename}`;
    }

    const user = await User.findOneAndUpdate(
      {userid: req.params.id},
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
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

exports.updateStarredMeetings = async (req, res) => {
  try {
    const { email, meetingid } = req.body;
    // console.log("update" + req.body);

    const meeting = await Meeting.findOne({ meetingid: meetingid });
    // console.log(meeting);

    const user = await User.findOneAndUpdate(
      { email: email },
      { $push: { starredMeetings: meeting._id } },
      { new: true }
    );
    // console.log(user);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

exports.deleteStarredMeetings = async (req, res) => {
  try {
    const { email, meetingid } = req.body;
    console.log(req.body);
    
    const star = await Meeting.findOneAndUpdate({ meetingid: req.body.meetingid }, {isStarred:req.body.isStarred}, {new:true});

    const meeting = await Meeting.findOne({ meetingid: meetingid });
    // console.log(meeting);

    const user = await User.findOneAndUpdate(
      { email: email },
      { $pull: { starredMeetings: meeting._id } },
      { new: true }
    );
    console.log(user);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}
