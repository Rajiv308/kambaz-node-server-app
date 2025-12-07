import * as dao from "./dao.js";

export default function PazzaAnswerRoutes(app) {
  const findAnswersForPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const answers = await dao.findAnswersForPost(postId);
      res.json(answers);
    } catch (error) {
      console.error("Error fetching answers:", error);
      res.status(500).json({ error: "Failed to fetch answers" });
    }
  };

  const findStudentAnswersForPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const answers = await dao.findStudentAnswersForPost(postId);
      res.json(answers);
    } catch (error) {
      console.error("Error fetching student answers:", error);
      res.status(500).json({ error: "Failed to fetch student answers" });
    }
  };

  const findInstructorAnswersForPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const answers = await dao.findInstructorAnswersForPost(postId);
      res.json(answers);
    } catch (error) {
      console.error("Error fetching instructor answers:", error);
      res.status(500).json({ error: "Failed to fetch instructor answers" });
    }
  };

  const createAnswer = async (req, res) => {
    try {
      const { postId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const answerType =
        currentUser.role === "FACULTY" ? "instructor" : "student";

      const answer = {
        ...req.body,
        _id:
          req.body._id ||
          `answer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        post: postId,
        author: currentUser._id,
        authorName: `${currentUser.firstName} ${currentUser.lastName}`,
        authorRole: currentUser.role,
        answerType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newAnswer = await dao.createAnswer(answer);
      res.json(newAnswer);
    } catch (error) {
      console.error("Error creating answer:", error);
      res.status(500).json({ error: "Failed to create answer" });
    }
  };

  const updateAnswer = async (req, res) => {
    try {
      const { answerId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const answer = await dao.findAnswerById(answerId);
      if (!answer) {
        return res.status(404).json({ error: "Answer not found" });
      }

      if (answer.author !== currentUser._id && currentUser.role !== "FACULTY") {
        return res
          .status(403)
          .json({ error: "Not authorized to edit this answer" });
      }

      const updated = await dao.updateAnswer(answerId, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating answer:", error);
      res.status(500).json({ error: "Failed to update answer" });
    }
  };

  const deleteAnswer = async (req, res) => {
    try {
      const { answerId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const answer = await dao.findAnswerById(answerId);
      if (!answer) {
        return res.status(404).json({ error: "Answer not found" });
      }

      if (answer.author !== currentUser._id && currentUser.role !== "FACULTY") {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this answer" });
      }

      await dao.deleteAnswer(answerId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting answer:", error);
      res.status(500).json({ error: "Failed to delete answer" });
    }
  };

  app.get("/api/pazza/posts/:postId/answers", findAnswersForPost);
  app.get(
    "/api/pazza/posts/:postId/answers/students",
    findStudentAnswersForPost
  );
  app.get(
    "/api/pazza/posts/:postId/answers/instructors",
    findInstructorAnswersForPost
  );
  app.post("/api/pazza/posts/:postId/answers", createAnswer);
  app.put("/api/pazza/answers/:answerId", updateAnswer);
  app.delete("/api/pazza/answers/:answerId", deleteAnswer);
}
