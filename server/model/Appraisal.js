import mongoose from "mongoose";

const appraisalSchema = new mongoose.Schema(
  {
    memberName: {
      type: String,
      required: true,
      trim: true,
    },
    memberRole: {
      type: String,
      required: true,
      trim: true,
    },
    reviewerName: {
      type: String,
      required: true,
      trim: true,
    },
    appraisalPeriod: {
      type: String,
      required: true,
      trim: true,
    },
    scores: {
      leadership: { type: Number, required: true, min: 1, max: 5 },
      engagement: { type: Number, required: true, min: 1, max: 5 },
      governance: { type: Number, required: true, min: 1, max: 5 },
      ethics: { type: Number, required: true, min: 1, max: 5 },
      collaboration: { type: Number, required: true, min: 1, max: 5 },
    },
    averageScore: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    keyContributions: {
      type: String,
      required: true,
      trim: true,
    },
    improvementPriorities: {
      type: String,
      required: true,
      trim: true,
    },
    recommendation: {
      type: String,
      required: true,
      enum: ["retain", "expand", "development", "review"],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Appraisal = mongoose.model("Appraisal", appraisalSchema);

export default Appraisal;
