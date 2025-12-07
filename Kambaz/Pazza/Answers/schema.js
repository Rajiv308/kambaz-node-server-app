import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    post: { type: String, ref: "PostModel", required: true },
    author: { type: String, ref: "UserModel", required: true },
    authorName: { type: String, required: true },
    authorRole: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN"],
      required: true,
    },
    answerType: {
      type: String,
      enum: ["student", "instructor"],
      required: true,
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "pazza_answers" }
);

answerSchema.index({ post: 1, answerType: 1 });

export default answerSchema;
