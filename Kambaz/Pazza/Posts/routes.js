import * as dao from "./dao.js";

export default function PazzaPostRoutes(app) {
  const findPostsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { folder, search } = req.query;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      let posts;
      if (search) {
        posts = await dao.searchPosts(
          courseId,
          search,
          currentUser._id,
          currentUser.role
        );
      } else if (folder) {
        posts = await dao.findPostsByFolder(
          courseId,
          folder,
          currentUser._id,
          currentUser.role
        );
      } else {
        posts = await dao.findPostsForCourse(
          courseId,
          currentUser._id,
          currentUser.role
        );
      }

      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  };

  const findPostById = async (req, res) => {
    try {
      const { postId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const post = await dao.findPostById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const isFacultyOrAdmin =
        currentUser.role === "FACULTY" || currentUser.role === "ADMIN";
      const canView =
        isFacultyOrAdmin ||
        post.postTo === "Entire Class" ||
        post.author === currentUser._id ||
        post.visibleTo.includes(currentUser._id);

      if (!canView) {
        return res
          .status(403)
          .json({ error: "You don't have permission to view this post" });
      }

      await dao.incrementViews(postId, currentUser._id);

      const updatedPost = await dao.findPostById(postId);
      res.json(updatedPost);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  };

  const createPost = async (req, res) => {
    try {
      const { courseId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const postNumber = await dao.getNextPostNumber();

      const post = {
        ...req.body,
        _id:
          req.body._id ||
          `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        postNumber,
        course: courseId,
        author: currentUser._id,
        authorName: `${currentUser.firstName} ${currentUser.lastName}`,
        authorRole: currentUser.role,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        viewedBy: [],
        postTo: req.body.postTo || "Entire Class",
        visibleTo:
          req.body.postTo === "Individual" ? req.body.visibleTo || [] : [],
      };

      const newPost = await dao.createPost(post);
      res.json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  };

  const updatePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const post = await dao.findPostById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const isFacultyOrAdmin =
        currentUser.role === "FACULTY" || currentUser.role === "ADMIN";
      if (post.author !== currentUser._id && !isFacultyOrAdmin) {
        return res
          .status(403)
          .json({ error: "Not authorized to edit this post" });
      }

      const updates = { ...req.body };
      if (updates.postTo === "Individual" && updates.visibleTo) {
        updates.visibleTo = updates.visibleTo;
      } else if (updates.postTo === "Entire Class") {
        updates.visibleTo = [];
      }

      const updated = await dao.updatePost(postId, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  };

  const deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const post = await dao.findPostById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const isFacultyOrAdmin =
        currentUser.role === "FACULTY" || currentUser.role === "ADMIN";
      if (post.author !== currentUser._id && !isFacultyOrAdmin) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this post" });
      }

      await dao.deletePost(postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  };

  const getStatistics = async (req, res) => {
    try {
      const { courseId } = req.params;
      const stats = await dao.getStatistics(courseId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  };

  app.get("/api/courses/:courseId/pazza/posts", findPostsForCourse);
  app.get("/api/pazza/posts/:postId", findPostById);
  app.post("/api/courses/:courseId/pazza/posts", createPost);
  app.put("/api/pazza/posts/:postId", updatePost);
  app.delete("/api/pazza/posts/:postId", deletePost);
  app.get("/api/courses/:courseId/pazza/statistics", getStatistics);
}
