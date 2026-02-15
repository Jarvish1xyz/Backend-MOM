const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: String,
    meetingid: { type: Number, unique: true },
    Date: { type: Date, required: true },
    agenda: String,
    note: String,
    calledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGoogle: {type: Boolean, enum:['true', 'false'], default: false},
    googleMeetLink: {type: String, default: null},
    eventId: {type: String, default: null},
    status: {type: String, enum: ['Pending', 'Done'], default: 'Pending'}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
