import * as dao from "./dao.js";

export default function PazzaFollowupRoutes(app) {
  const findFollowupsForPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const followups = await dao.findFollowupsForPost(postId);
      res.json(followups);
    } catch (error) {
      console.error("Error fetching followups:", error);
      res.status(500).json({ error: "Failed to fetch followups" });
    }
  };

  const createFollowup = async (req, res) => {
    try {
      const { postId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const followup = {
        ...req.body,
        _id:
          req.body._id ||
          `followup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        post: postId,
        author: currentUser._id,
        authorName: `${currentUser.firstName} ${currentUser.lastName}`,
        authorRole: currentUser.role,
        resolved: false,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newFollowup = await dao.createFollowup(followup);
      res.json(newFollowup);
    } catch (error) {
      console.error("Error creating followup:", error);
      res.status(500).json({ error: "Failed to create followup" });
    }
  };

  const updateFollowup = async (req, res) => {
    try {
      const { followupId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const followup = await dao.findFollowupById(followupId);
      if (!followup) {
        return res.status(404).json({ error: "Followup not found" });
      }

      if (
        followup.author !== currentUser._id &&
        currentUser.role !== "FACULTY"
      ) {
        return res
          .status(403)
          .json({ error: "Not authorized to edit this followup" });
      }

      const updated = await dao.updateFollowup(followupId, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating followup:", error);
      res.status(500).json({ error: "Failed to update followup" });
    }
  };

  const toggleResolved = async (req, res) => {
    try {
      const { followupId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const updated = await dao.toggleResolved(followupId);
      res.json(updated);
    } catch (error) {
      console.error("Error toggling resolved:", error);
      res.status(500).json({ error: "Failed to toggle resolved status" });
    }
  };

  const deleteFollowup = async (req, res) => {
    try {
      const { followupId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const followup = await dao.findFollowupById(followupId);
      if (!followup) {
        return res.status(404).json({ error: "Followup not found" });
      }

      if (
        followup.author !== currentUser._id &&
        currentUser.role !== "FACULTY"
      ) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this followup" });
      }

      await dao.deleteFollowup(followupId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting followup:", error);
      res.status(500).json({ error: "Failed to delete followup" });
    }
  };

  const addReply = async (req, res) => {
    try {
      const { followupId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const reply = {
        _id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        author: currentUser._id,
        authorName: `${currentUser.firstName} ${currentUser.lastName}`,
        authorRole: currentUser.role,
        content: req.body.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updated = await dao.addReply(followupId, reply);
      res.json(updated);
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(500).json({ error: "Failed to add reply" });
    }
  };

  const updateReply = async (req, res) => {
    try {
      const { followupId, replyId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const followup = await dao.findFollowupById(followupId);
      if (!followup) {
        return res.status(404).json({ error: "Followup not found" });
      }

      const reply = followup.replies.find((r) => r._id === replyId);
      if (!reply) {
        return res.status(404).json({ error: "Reply not found" });
      }

      if (reply.author !== currentUser._id && currentUser.role !== "FACULTY") {
        return res
          .status(403)
          .json({ error: "Not authorized to edit this reply" });
      }

      const updated = await dao.updateReply(followupId, replyId, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating reply:", error);
      res.status(500).json({ error: "Failed to update reply" });
    }
  };

  const deleteReply = async (req, res) => {
    try {
      const { followupId, replyId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const followup = await dao.findFollowupById(followupId);
      if (!followup) {
        return res.status(404).json({ error: "Followup not found" });
      }

      const reply = followup.replies.find((r) => r._id === replyId);
      if (!reply) {
        return res.status(404).json({ error: "Reply not found" });
      }

      if (reply.author !== currentUser._id && currentUser.role !== "FACULTY") {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this reply" });
      }

      const updated = await dao.deleteReply(followupId, replyId);
      res.json(updated);
    } catch (error) {
      console.error("Error deleting reply:", error);
      res.status(500).json({ error: "Failed to delete reply" });
    }
  };

  app.get("/api/pazza/posts/:postId/followups", findFollowupsForPost);
  app.post("/api/pazza/posts/:postId/followups", createFollowup);
  app.put("/api/pazza/followups/:followupId", updateFollowup);
  app.put("/api/pazza/followups/:followupId/toggle-resolved", toggleResolved);
  app.delete("/api/pazza/followups/:followupId", deleteFollowup);
  app.post("/api/pazza/followups/:followupId/replies", addReply);
  app.put("/api/pazza/followups/:followupId/replies/:replyId", updateReply);
  app.delete("/api/pazza/followups/:followupId/replies/:replyId", deleteReply);
}
