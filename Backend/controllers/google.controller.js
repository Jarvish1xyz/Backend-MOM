const oauth2Client = require("../utils/googleAuth");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.authGoogle = (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userEmail = decoded.email;

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/calendar"],
      state: userEmail,
    });

    res.redirect(url);

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.authGoogleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).send("Missing code or state");
    }

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return res.status(400).send("No refresh token received");
    }

    const userEmail = state;

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      {
        googleRefreshToken: tokens.refresh_token,
        googleConnected: true,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.redirect("https://probable-meme-g474x6r4v95v2wxjv-3000.app.github.dev/create-meeting?google=success");

  } catch (error) {
    console.error(error);
    res.status(500).send("Google connection failed");
  }
};
