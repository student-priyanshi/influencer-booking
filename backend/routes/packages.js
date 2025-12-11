import express from "express";
import { adminAuth } from "../middleware/auth.js";
import Package from "../models/Package.js";

const router = express.Router();

// Get all packages
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find().populate("influencer");
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single package
router.get("/:id", async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate("influencer");
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create package (Admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const pkg = new Package(req.body);
    await pkg.save();
    await pkg.populate("influencer");
    res.status(201).json(pkg);
  } catch (error) {
    res.status(400).json({ message: "Error creating package", error: error.message });
  }
});

// Update package (Admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("influencer");

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(pkg);
  } catch (error) {
    res.status(400).json({ message: "Error updating package", error: error.message });
  }
});

// Delete package (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
