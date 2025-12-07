import mongoose from "mongoose";
import answerSchema from "./schema.js";

const AnswerModel = mongoose.model("AnswerModel", answerSchema);

export default AnswerModel;
