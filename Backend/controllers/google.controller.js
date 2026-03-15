const oauth2Client = require("../utils/googleAuth");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.googleLoginTrigger = (req, res) => {
  // This creates the URL for the "Login with Google" button
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", 
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/calendar" // Keeps your Meet feature active
    ],
  });

  res.redirect(url);
};

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
    const urlToFrontend = process.env.FRONTEND_URL;

    res.redirect(`${urlToFrontend}/auth/create-meeting?google=success`);

  } catch (error) {
    console.error(error);
    res.status(500).send("Google connection failed");
  }
};
