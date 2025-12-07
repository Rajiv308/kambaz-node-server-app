import mongoose from "mongoose";
import followupSchema from "./schema.js";

const FollowupModel = mongoose.model("FollowupModel", followupSchema);

export default FollowupModel;
