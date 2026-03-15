const oauth2Client = require("../utils/googleAuth");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// google.controller.js (Add this at the bottom)
const { google } = require('googleapis');

exports.googleLoginCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 1. Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // 2. Look for user by email
    let user = await User.findOne({ email: data.email });

    if (!user) {
      // REGISTER: If user doesn't exist, create them
      // We use your existing generateUserId function logic here
      const newUserId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      
      user = new User({
        name: data.name,
        username: data.email.split('@')[0], // Create a username from email
        userid: newUserId,
        email: data.email,
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
        googleConnected: true,
        role: "Employee" // Default role
      });
    }

    // 3. Always update the refresh token if Google sends it
    user.googleConnected = true;
    if (tokens.refresh_token) {
      user.googleRefreshToken = tokens.refresh_token;
    }
    await user.save();

    // 4. Create your App JWT (Same logic as your auth.controller.js)
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Redirect to Frontend with Token and User Data
    const userData = JSON.stringify({
      id: user._id,
      userid: user.userid,
      email: user.email,
      role: user.role,
      name: user.name
    });

    // Send them to the new success page we will add in App.js
    res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}&user=${encodeURIComponent(userData)}`);

  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.FRONTEND_URL}/auth?error=google_failed`);
  }
};

exports.googleLoginTrigger = (req, res) => {
  // This creates the URL for the "Login with Google" button
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent select_account", 
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

    res.redirect(`${urlToFrontend}/create-meeting?google=success`);

  } catch (error) {
    console.error(error);
    res.status(500).send("Google connection failed");
  }
};

