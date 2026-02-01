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
    const meetings = await User.findById(req.user.id).populate("meetings");
    res.json({meetings: meetings.meetings});
  }catch(err) {
    res.status(500).json({err:err.message});
  }
}

exports.getMeetingDetail = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ meetingid: req.params.id }).populate("calledBy", "email username").populate("members", "email username");
    console.log(meeting);
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch meeting details" });
  }
}