import * as dao from "./dao.js";

export default function PazzaFolderRoutes(app) {
  const findFoldersForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      await dao.initializeDefaultFolders(courseId);
      const folders = await dao.findFoldersForCourse(courseId);
      res.json(folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
      res.status(500).json({ error: "Failed to fetch folders" });
    }
  };

  const createFolder = async (req, res) => {
    try {
      const { courseId } = req.params;
      const folder = {
        ...req.body,
        _id: req.body._id || `${courseId}-folder-${Date.now()}`,
        course: courseId,
        createdAt: new Date(),
      };
      const newFolder = await dao.createFolder(folder);
      res.json(newFolder);
    } catch (error) {
      console.error("Error creating folder:", error);
      res.status(500).json({ error: "Failed to create folder" });
    }
  };

  const updateFolder = async (req, res) => {
    try {
      const { folderId } = req.params;
      const updated = await dao.updateFolder(folderId, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating folder:", error);
      res.status(500).json({ error: "Failed to update folder" });
    }
  };

  const deleteFolder = async (req, res) => {
    try {
      const { folderId } = req.params;
      await dao.deleteFolder(folderId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting folder:", error);
      res.status(500).json({ error: "Failed to delete folder" });
    }
  };

  const deleteMultipleFolders = async (req, res) => {
    try {
      const { folderIds } = req.body;
      await dao.deleteFolders(folderIds);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting folders:", error);
      res.status(500).json({ error: "Failed to delete folders" });
    }
  };

  app.get("/api/courses/:courseId/pazza/folders", findFoldersForCourse);
  app.post("/api/courses/:courseId/pazza/folders", createFolder);
  app.put("/api/pazza/folders/:folderId", updateFolder);
  app.delete("/api/pazza/folders/:folderId", deleteFolder);
  app.post("/api/pazza/folders/delete-multiple", deleteMultipleFolders);
}
