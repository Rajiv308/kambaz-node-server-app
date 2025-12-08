import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  author: { type: String, ref: "UserModel", required: true },
  authorName: { type: String, required: true },
  authorRole: {
    type: String,
    enum: ["STUDENT", "FACULTY", "ADMIN", "ASSISTANT"],
    required: true,
  },
  content: { type: String, required: true },
  lastEditedBy: { type: String },
  lastEditedByName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const followupSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    post: { type: String, ref: "PostModel", required: true },
    author: { type: String, ref: "UserModel", required: true },
    authorName: { type: String, required: true },
    authorRole: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN", "ASSISTANT"],
      required: true,
    },
    content: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    replies: [replySchema],
    lastEditedBy: { type: String },
    lastEditedByName: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "pazza_followups" }
);

export default followupSchema;
