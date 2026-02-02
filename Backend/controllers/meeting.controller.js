const Meeting = require('../models/Meeting');
const User = require('../models/User');


exports.addMeeting = async (req, res) => {
  try {
    const { title, id, date, time, agenda, note, calledByEmail, membersEmail } = req.body;

    const meetingDate = new Date(`${date}T${time}:00`);

    const calledByUser = await User.findOne({ email: calledByEmail });
    if (!calledByUser) {
      return res.status(404).json({ msg: " Caller not found ! " });
    }

    const members = await User.find({
      email: { $in: membersEmail }
    }).select("_id");

    const meeting = await Meeting.create({
      title,
      meetingid: Number(id),
      Date: meetingDate,
      agenda,
      note,
      calledBy: calledByUser._id,
      members: members.map(m => m._id)
    });

    console.log(meeting);

    res.status(201).json({
      msg: "New meeting registered",
      meeting
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};


exports.getAllMeeting = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .sort({ createdAt: -1 })
      .populate("calledBy", "email username")
      .populate("members", "email username");

    res.json(meetings);
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch meetings" });
  }
};

exports.getMyMeetings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("meetings");
    res.json({meetings: user.meetings});
  }catch(err) {
    res.status(500).json({err:err.message});
  }
}

exports.getMyStarredMeetings = async (req, res) => {
  try {
    const meetings = await User.findById(req.user.id).populate("starredMeetings");
    res.json({meetings: meetings.starredMeetings});
  }catch(err) {
    res.status(500).json({err:err.message});
  }
}

exports.getMeetingDetail = async (req, res) => {
  try {
    console.log(req.user);
    const stared = await User.findById(req.user.id).populate("starredMeetings", "meetingid");
    console.log(stared);
    const meeting = await Meeting.findOne({ meetingid: req.params.id }).populate("calledBy", "email username").populate("members", "email username starredMeetings");
    console.log({ starforUser: stared.starredMeetings.some(m => m.meetingid === Number(req.params.id))});
    res.json({meeting, starforUser: stared.starredMeetings.some(m => m.meetingid === Number(req.params.id))});
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch meeting details" });
  }
}

exports.updateStatus = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndUpdate({ meetingid: req.params.id }, {status:req.body.status}, {new:true});
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ err: "Failed to update meeting status" });
  }
}