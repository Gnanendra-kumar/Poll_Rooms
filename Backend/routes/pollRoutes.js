import express from "express";
import Poll from "../models/Poll.js";

const router = express.Router();

// CREATE POLL
router.post("/", async (req, res) => {
  try {
    console.log("CREATE POLL BODY:", req.body);

    const { question, options, expiresAt } = req.body;

    // Basic validation
    if (!question || !Array.isArray(options)) {
      return res.status(400).json({
        message: "Invalid question or options format"
      });
    }

    // Clean options
    const cleanedOptions = options
      .map(o => o.trim())
      .filter(o => o.length > 0);

    if (cleanedOptions.length < 2) {
      return res.status(400).json({
        message: "At least 2 options are required"
      });
    }

    // Duplicate check (case-insensitive)
    const normalized = cleanedOptions.map(o => o.toLowerCase());
    if (new Set(normalized).size !== normalized.length) {
      return res.status(400).json({
        message: "Duplicate options are not allowed"
      });
    }

    // Build poll safely
    const pollData = {
      question: question.trim(),
      options: cleanedOptions.map(text => ({ text }))
    };

    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (!isNaN(expiryDate)) {
        pollData.expiresAt = expiryDate;
      }
    }

    const poll = await Poll.create(pollData);
    res.json(poll);

  } catch (err) {
    console.error("CREATE POLL ERROR:", err);
    res.status(500).json({
      message: "Server error while creating poll"
    });
  }
});

// GET POLL
router.get("/:id", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  res.json(poll);
});

export default router;