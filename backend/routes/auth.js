import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    let exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    // HASH PASSWORD
    const hashed = await bcrypt.hash(password, 10);

    // ADMIN ROLE DECISION
    // 1) Allow-list certain emails from env (comma-separated) or fallback to common defaults
    const allowedAdmins = (process.env.ADMIN_EMAILS || "admin@gmail.com,admin@gail.com")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    let finalRole = "user";
    const emailLc = (email || "").toLowerCase();

    if (allowedAdmins.includes(emailLc)) {
      finalRole = "admin";
    } else if (role === "admin") {
      // 2) If client explicitly requests admin, allow it
      // NOTE: For production, protect this by invite/approval flow
      finalRole = "admin";
    } else {
      finalRole = "user";
    }

    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      role: finalRole,
    });

    const token = generateToken(user._id);

    res.json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// CURRENT USER
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
