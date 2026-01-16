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
    isStared: {type: Boolean, default: false},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
