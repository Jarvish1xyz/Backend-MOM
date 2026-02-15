const Meeting = require("../models/Meeting");
const User = require("../models/User");
const oauth2Client = require("../utils/googleAuth");
const { google } = require("googleapis");

exports.addMeeting = async (req, res) => {
  try {
    const {
      title,
      id,
      date,
      time,
      agenda,
      note,
      membersEmail,
      isGoogle,
    } = req.body;
    // console.log(req.body);
    
    const meetingDate = new Date(`${date}T${time}:00+05:30`);
    // console.log(meetingDate);

    const calledByUser = await User.findById(req.user.id);

    if (!calledByUser) {
      return res.status(404).json({ msg: "Caller not found!" });
    }

    const members = await User.find({
      email: { $in: membersEmail },
    }).select("_id");

    let googleMeetLink = null;
    let eventId = null;

    if (isGoogle) {

      if (!calledByUser.googleRefreshToken) {
        return res.status(400).json({
          msg: "Google not connected. Please connect first.",
        });
      }

      oauth2Client.setCredentials({
        refresh_token: calledByUser.googleRefreshToken,
      });

      const calendar = google.calendar({
        version: "v3",
        auth: oauth2Client,
      });

      const startDateTime = new Date(`${date}T${time}:00+05:30`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60000);

      const event = {
        summary: title,
        description: agenda,
        start: {
          dateTime: startDateTime,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: endDateTime,
          timeZone: "Asia/Kolkata",
        },
        conferenceData: {
          createRequest: {
            requestId: new Date().getTime().toString(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      };

      const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
      });

      googleMeetLink =
        response.data.conferenceData.entryPoints[0].uri;

      eventId = response.data.id;
    }

    const meeting = await Meeting.create({
      title,
      meetingid: Number(id),
      Date: meetingDate,
      agenda,
      note,
      calledBy: calledByUser._id,
      members: members.map((m) => m._id),
      googleMeetLink,
      eventId,
    });

    res.status(201).json({
      msg: "New meeting registered",
      meeting,
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
    res.json({ meetings: user.meetings });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.getMyStarredMeetings = async (req, res) => {
  try {
    const meetings = await User.findById(req.user.id).populate(
      "starredMeetings",
    );
    res.json({ meetings: meetings.starredMeetings });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.getMeetingDetail = async (req, res) => {

  try {
    const user = await User.findById(req.user.id).populate(
      "starredMeetings",
      "meetingid",
    );
    if (!user) return res.status(404).json({ err: "User not found" });

    const meeting = await Meeting.findOne({ meetingid: req.params.id })
      .populate("calledBy", "email username")
      .populate("members", "email username starredMeetings");

    if (!meeting) {
      return res.status(404).json({ err: "Meeting not found" });
    }

    const starredList = user.starredMeetings || [];
    // console.log(starredList);
    const isStarred = starredList.some((m) => (m.meetingid) === Number(req.params.id));
    // console.log(isStarred, req.params.id);

    res.json({ meeting, starforUser: isStarred });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndUpdate(
      { meetingid: req.params.id },
      { status: req.body.status },
      { new: true },
    );
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ err: "Failed to update meeting status" });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({meetingid :req.params.id});

    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

    // 🔥 If meeting has Google event
    if (meeting.eventId) {

      const user = await User.findById(meeting.calledBy);

      if (user && user.googleRefreshToken) {

        oauth2Client.setCredentials({
          refresh_token: user.googleRefreshToken,
        });

        const calendar = google.calendar({
          version: "v3",
          auth: oauth2Client,
        });

        try {
          await calendar.events.delete({
            calendarId: "primary",
            eventId: meeting.eventId,
          });
        } catch (err) {
          console.log("Google event already deleted or error:", err.message);
        }
      }
    }

    // 🔥 Delete from your DB
    await meeting.deleteOne();

    res.json({ msg: "Meeting deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
