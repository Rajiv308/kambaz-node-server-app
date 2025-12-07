import AnswerModel from "./model.js";

export const findAnswersForPost = async (postId) => {
  return AnswerModel.find({ post: postId }).sort({ createdAt: 1 });
};

export const findStudentAnswersForPost = async (postId) => {
  return AnswerModel.find({ post: postId, answerType: "student" }).sort({
    createdAt: 1,
  });
};

export const findInstructorAnswersForPost = async (postId) => {
  return AnswerModel.find({ post: postId, answerType: "instructor" }).sort({
    createdAt: 1,
  });
};

export const findAnswerById = async (answerId) => {
  return AnswerModel.findById(answerId);
};

export const createAnswer = async (answer) => {
  return AnswerModel.create(answer);
};

export const updateAnswer = async (answerId, updates) => {
  updates.updatedAt = new Date();
  return AnswerModel.findByIdAndUpdate(answerId, updates, { new: true });
};

export const deleteAnswer = async (answerId) => {
  return AnswerModel.findByIdAndDelete(answerId);
};

export const deleteAnswersForPost = async (postId) => {
  return AnswerModel.deleteMany({ post: postId });
};

export const countAnswersByType = async (courseId, postIds) => {
  const studentAnswers = await AnswerModel.countDocuments({
    post: { $in: postIds },
    answerType: "student",
  });
  const instructorAnswers = await AnswerModel.countDocuments({
    post: { $in: postIds },
    answerType: "instructor",
  });
  return { studentAnswers, instructorAnswers };
};
