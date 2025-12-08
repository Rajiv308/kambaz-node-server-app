import PostModel from "./model.js";
import { countAnswersByType } from "../Answers/dao.js";

export const findPostsForCourse = async (courseId, userId, userRole) => {
  const isFacultyOrAdmin = userRole === "FACULTY" || userRole === "ADMIN";

  const query = {
    course: courseId,
  };

  if (!isFacultyOrAdmin) {
    query.$or = [
      { postTo: "Entire Class" },
      { author: userId },
      { visibleTo: userId },
    ];
  }

  return PostModel.find(query).sort({ createdAt: -1 });
};

export const findPostsByFolder = async (
  courseId,
  folderId,
  userId,
  userRole
) => {
  const isFacultyOrAdmin = userRole === "FACULTY" || userRole === "ADMIN";

  const query = {
    course: courseId,
    folders: folderId,
  };

  if (!isFacultyOrAdmin) {
    query.$or = [
      { postTo: "Entire Class" },
      { author: userId },
      { visibleTo: userId },
    ];
  }

  return PostModel.find(query).sort({ createdAt: -1 });
};

export const searchPosts = async (courseId, searchText, userId, userRole) => {
  const isFacultyOrAdmin = userRole === "FACULTY" || userRole === "ADMIN";

  const query = {
    course: courseId,
    $or: [
      { summary: { $regex: searchText, $options: "i" } },
      { details: { $regex: searchText, $options: "i" } },
    ],
  };

  if (!isFacultyOrAdmin) {
    query.$and = [
      {
        $or: [
          { postTo: "Entire Class" },
          { author: userId },
          { visibleTo: userId },
        ],
      },
    ];
  }

  return PostModel.find(query).sort({ createdAt: -1 });
};

export const findPostById = async (postId) => {
  return PostModel.findById(postId);
};

export const createPost = async (post) => {
  return PostModel.create(post);
};

export const updatePost = async (postId, updates) => {
  updates.updatedAt = new Date();
  return PostModel.findByIdAndUpdate(postId, updates, { new: true });
};

export const deletePost = async (postId) => {
  return PostModel.findByIdAndDelete(postId);
};

export const findPostIdsByCourse = async (courseId) => {
  const posts = await PostModel.find({ course: courseId }, { _id: 1 });
  return posts.map((p) => p._id);
};

export const incrementViews = async (postId, userId) => {
  const post = await PostModel.findById(postId);
  if (post && !post.viewedBy.includes(userId)) {
    post.viewedBy.push(userId);
    post.views = post.viewedBy.length;
    await post.save();
  }
  return post;
};

export const getStatistics = async (courseId) => {
  const posts = await PostModel.find({ course: courseId });

  const questions = posts.filter((p) => p.postType === "Question");
  const notes = posts.filter((p) => p.postType === "Note");
  const { studentAnswers, instructorAnswers } = await countAnswersByType(
    courseId,
    posts
  );

  return {
    totalPosts: posts.length,
    totalQuestions: questions.length,
    totalNotes: notes.length,
    studentAnswers: studentAnswers,
    instructorAnswers: instructorAnswers,
  };
};

export const getNextPostNumber = async () => {
  const lastPost = await PostModel.findOne().sort({ postNumber: -1 });
  return lastPost ? lastPost.postNumber + 1 : 1;
};
