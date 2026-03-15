const oauth2Client = require("../utils/googleAuth");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { google } = require('googleapis');

// google.controller.js

// 🔐 GOOGLE LOGIN CALLBACK
exports.googleLoginCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // LOOKUP: Only find existing user
    const user = await User.findOne({ email: data.email });

    if (!user) {
      // If user doesn't exist, stop them!
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=user_not_found`);
    }

    // Success: Update token and redirect
    user.googleConnected = true;
    if (tokens.refresh_token) user.googleRefreshToken = tokens.refresh_token;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const userData = JSON.stringify({ id: user._id, name: user.name, email: user.email });
    
    res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}&user=${encodeURIComponent(userData)}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth?error=login_failed`);
  }
};

// 📝 GOOGLE REGISTER CALLBACK
exports.googleRegisterCallback = async (req, res) => {
  console.log("1. Callback hit by Google"); // Check if Google even reaches your backend
  try {
    const { code } = req.query;

    // FIX: You MUST pass the same redirect_uri used in the 'trigger' step
    const { tokens } = await oauth2Client.getToken({
      code: code,
      redirect_uri: process.env.GOOGLE_REGISTER_REDIRECT_URI 
    });
    
    console.log("1.5 Tokens received successfully");
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    console.log("2. Google Data received for:", data.email);

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      console.log("3. User already exists");
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=user_exists`);
    }

    const newUser = new User({
      name: data.name,
      username: data.email.split('@')[0] + Math.floor(Math.random() * 100),
      userid: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      email: data.email,
      password: await bcrypt.hash(Math.random().toString(36), 10),
      phone: "0000000000",
      role: "Employee",
      googleConnected: true,
      googleRefreshToken: tokens.refresh_token
    });

    await newUser.save();
    console.log("4. User saved to MongoDB successfully");

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const userData = JSON.stringify({ 
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    });

    res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}&user=${encodeURIComponent(userData)}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth?error=registration_failed`);
  }
};
// exports.googleRegisterCallback = async (req, res) => {
//   try {
//     const { code } = req.query;
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);
    
//     const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
//     const { data } = await oauth2.userinfo.get();

//     const existingUser = await User.findOne({ email: data.email });
//     if (existingUser) {
//       // If user exists, tell them to login instead
//       return res.redirect(`${process.env.FRONTEND_URL}/auth?error=user_exists`);
//     }

//     // CREATE: Build the new user using your specific model fields
//     const newUser = new User({
//       name: data.name,
//       username: data.email.split('@')[0] + Math.floor(Math.random() * 100),
//       userid: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
//       email: data.email,
//       password: await bcrypt.hash(Math.random().toString(36), 10),
//       role: "Employee",
//       googleConnected: true,
//       googleRefreshToken: tokens.refresh_token
//     });

//     await newUser.save();

//     const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
//     const userData = JSON.stringify({ 
//       id: newUser._id,
//       name: newUser.name,
//       email: newUser.email
//     });

//     res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}&user=${encodeURIComponent(userData)}`);
//   } catch (error) {
//     res.redirect(`${process.env.FRONTEND_URL}/auth?error=registration_failed`);
//   }
// };

// Function for Login Button
exports.googleLoginTrigger = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "select_account",
    redirect_uri: process.env.GOOGLE_LOGIN_REDIRECT_URI, // Points to login callback
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"]
  });
  res.redirect(url);
};

// Function for Register Button
exports.googleRegisterTrigger = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    redirect_uri: process.env.GOOGLE_REGISTER_REDIRECT_URI, // Points to register callback
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"]
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

