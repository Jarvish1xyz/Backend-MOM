const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: String,
    meetingid: { type: String, unique: true },
    Date: { type: Date, required: true },
    agenda: String,
    note: String,
    calledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isStarred: {type: Boolean, enum:['true', 'false'], default: false},
    status: {type: String, enum: ['Pending', 'Done'], default: 'Pending'}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
