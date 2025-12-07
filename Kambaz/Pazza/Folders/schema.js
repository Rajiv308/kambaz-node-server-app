import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    course: { type: String, ref: "CourseModel", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "pazza_folders" }
);

export default folderSchema;
