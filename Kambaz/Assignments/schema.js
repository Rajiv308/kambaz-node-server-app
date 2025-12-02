import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String },
    course: { type: String, ref: "Course", required: true },
    points: { type: Number, default: 100 },
    availableFrom: { type: String },
    dueDate: { type: String },
    availableUntil: { type: String },
    group: { type: String },
    description: { type: String },
    displayAs: { type: String },
    submissionType: { type: String },
    onlineOptions: { type: [String], default: [] },
    assignTo: { type: String, default: "Everyone" },
  },
  { collection: "assignments" }
);

export default assignmentSchema;
