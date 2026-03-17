const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { google } = require('googleapis');

/**
 * Helper to create a fresh OAuth2 Client for each request.
 * This prevents Redirect URI contamination between Login, Register, and Meetings.
 */
const createOAuthClient = (redirectUri) => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
};

// 🔐 GOOGLE LOGIN
exports.googleLoginTrigger = (req, res) => {
  const client = createOAuthClient(process.env.GOOGLE_LOGIN_REDIRECT_URI);
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "select_account",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/calendar"
    ],
  });
  res.redirect(url);
};

exports.googleLoginCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const client = createOAuthClient(process.env.GOOGLE_LOGIN_REDIRECT_URI);
    
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const { data } = await oauth2.userinfo.get();

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=user_not_found`);
    }

    user.googleConnected = true;
    if (tokens.refresh_token) user.googleRefreshToken = tokens.refresh_token;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const userData = {
      id: user._id,
      userid: user.userid,
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department
    };

    res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  } catch (error) {
    console.error("Login Callback Error:", error.message);
    res.redirect(`${process.env.FRONTEND_URL}/auth?error=login_failed`);
  }
};

// 📝 GOOGLE REGISTER
exports.googleRegisterTrigger = (req, res) => {
  const client = createOAuthClient(process.env.GOOGLE_REGISTER_REDIRECT_URI);
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"]
  });
  res.redirect(url);
};

exports.googleRegisterCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const client = createOAuthClient(process.env.GOOGLE_REGISTER_REDIRECT_URI);
    
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const { data } = await oauth2.userinfo.get();

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=user_exists`);
    }

    const newUser = new User({
      name: data.name,
      username: data.email.split('@')[0],
      userid: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      email: data.email,
      password: await bcrypt.hash(data.name, 10),
      phone: "0000000000",
      role: "Employee",
      googleConnected: true,
      googleRefreshToken: tokens.refresh_token
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const userData = { id: newUser._id, name: newUser.name, email: newUser.email };

    res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  } catch (error) {
    console.error("Register Callback Error:", error.message);
    res.redirect(`${process.env.FRONTEND_URL}/auth?error=registration_failed`);
  }
};

// 📅 GOOGLE CALENDAR / MEETING AUTH
exports.authGoogle = (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = createOAuthClient(process.env.GOOGLE_MEETING_REDIRECT_URI);

    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/calendar"],
      state: decoded.email, // State is crucial for the callback
    });

    res.redirect(url);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.authGoogleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    // Log for debugging
    console.log("Meeting Callback - Code exists:", !!code, "State (Email):", state);

    if (!code || !state) {
      return res.status(400).send("Missing code or state from Google");
    }

    const client = createOAuthClient(process.env.GOOGLE_MEETING_REDIRECT_URI);

    // Exchange the code for tokens
    const { tokens } = await client.getToken(code);
    
    const updateData = { googleConnected: true };
    if (tokens.refresh_token) {
      updateData.googleRefreshToken = tokens.refresh_token;
    }

    // Find user by email passed in 'state'
    const user = await User.findOneAndUpdate(
      { email: state },
      updateData,
      { new: true }
    );

    if (!user) return res.status(404).send("User not found after Google auth");

    res.redirect(`${process.env.FRONTEND_URL}/create-meeting?google=success`);
  } catch (error) {
    console.error("Meeting Callback Error:", error.message);
    res.status(500).send("Google connection failed");
  }
};