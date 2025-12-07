import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    postNumber: { type: Number, unique: true },
    course: { type: String, ref: "CourseModel", required: true },
    author: { type: String, ref: "UserModel", required: true },
    authorName: { type: String, required: true },
    authorRole: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN", "ASSISTANT"],
      required: true,
    },

    postType: { type: String, enum: ["Question", "Note"], default: "Question" },

    postTo: {
      type: String,
      enum: ["Entire Class", "Individual"],
      default: "Entire Class",
    },
    visibleTo: [{ type: String, ref: "UserModel" }],

    summary: { type: String, required: true, maxlength: 100 },
    details: { type: String, required: true },

    folders: [{ type: String }],

    views: { type: Number, default: 0 },
    viewedBy: [{ type: String, ref: "UserModel" }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "pazza_posts" }
);

postSchema.index({ course: 1, createdAt: -1 });
postSchema.index({ course: 1, folders: 1 });
postSchema.index({ visibleTo: 1 });

export default postSchema;
