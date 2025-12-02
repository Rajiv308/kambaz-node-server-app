import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao() {
  function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
  }

  function getAssignmentByAID(assignmentId) {
    return model.findOne({ _id: assignmentId });
  }

  function createAssignment(assignment) {
    console.log("Creating assignment:", assignment);
    const newAssignment = {
      _id: uuidv4(),
      ...assignment,
    };
    return model.create(newAssignment);
  }

  function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
  }

  function updateAssignment(assignmentId, updates) {
    return model.updateOne({ _id: assignmentId }, { $set: updates });
  }

  return {
    findAssignmentsForCourse,
    getAssignmentByAID,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
