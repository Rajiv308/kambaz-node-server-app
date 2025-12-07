import mongoose from "mongoose";
import folderSchema from "./schema.js";

const FolderModel = mongoose.model("FolderModel", folderSchema);

export default FolderModel;
