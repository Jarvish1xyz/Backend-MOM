const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, trim: true },
    userid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: String,
    role: { type: String, enum: ["HR", "Admin", "Employee"], default: "Employee" },
    profileImg: String,
    meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }],
    pendingmeetings: { type: Number, default: 0 },
    donemeetings: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
