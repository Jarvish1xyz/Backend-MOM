const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, trim: true },
    userid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: String,
    role: {
      type: String,
      enum: ["HR", "Admin", "Employee"],
      default: "Employee",
    },
    department: {type: String, default:null},
    profileImg: String,
    meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }],
    starredMeetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }],
    googleId: { type: String, unique: true, sparse: true },
    googleRefreshToken: {type: String, default: null},
    googleConnected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
