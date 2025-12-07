import FolderModel from "./model.js";

const DEFAULT_FOLDERS = [
  "hw1",
  "hw2",
  "hw3",
  "hw4",
  "hw5",
  "hw6",
  "project",
  "exam",
  "logistics",
  "other",
  "office_hours",
];

export const findFoldersForCourse = async (courseId) => {
  return FolderModel.find({ course: courseId }).sort({ createdAt: 1 });
};

export const findFolderById = async (folderId) => {
  return FolderModel.findById(folderId);
};

export const createFolder = async (folder) => {
  return FolderModel.create(folder);
};

export const updateFolder = async (folderId, updates) => {
  return FolderModel.findByIdAndUpdate(folderId, updates, { new: true });
};

export const deleteFolder = async (folderId) => {
  return FolderModel.findByIdAndDelete(folderId);
};

export const deleteFolders = async (folderIds) => {
  return FolderModel.deleteMany({ _id: { $in: folderIds } });
};

export const initializeDefaultFolders = async (courseId) => {
  const existing = await FolderModel.find({ course: courseId });
  if (existing.length === 0) {
    const folders = DEFAULT_FOLDERS.map((name, index) => ({
      _id: `${courseId}-folder-${index}-${Date.now()}`,
      name,
      course: courseId,
      createdAt: new Date(),
    }));
    return FolderModel.insertMany(folders);
  }
  return existing;
};
