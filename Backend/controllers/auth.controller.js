const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateUserId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};


// 🔐 REGISTER
exports.register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ msg: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      userid: generateUserId(),
      email,
      password: hashedPassword,
      phone: "0000000000", // temp
      role: "Employee"
    });

    console.log(user);

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: user._id,
        userid: user.userid,
        email: user.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        userid: user.userid,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
