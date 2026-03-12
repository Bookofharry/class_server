import express from "express";

import Appraisal from "../model/Appraisal.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const appraisal = await Appraisal.create(req.body);
    return res.status(201).json({
      message: "Appraisal submitted successfully",
      data: appraisal,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to submit appraisal",
      error: error.message,
    });
  }
});

export default router;
