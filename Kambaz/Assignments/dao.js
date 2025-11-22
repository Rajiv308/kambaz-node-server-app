import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(courseId) {
    return db.assignments.filter((a) => a.course === courseId);
  }

  function getAssignmentByAID(assignmentId) {
    const assignment = db.assignments.find((a) => a._id === assignmentId);
    return assignment;
  }

  function createAssignment(assignment) {
    const newAssignment = { ...assignment };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  }

  function deleteAssignment(assignmentId) {
    db.assignments = db.assignments.filter((a) => a._id !== assignmentId);
  }

  function updateAssignment(assignmentId, assignmentUpdates) {
    const index = db.assignments.findIndex((a) => a._id === assignmentId);
    if (index === -1) return null;
    db.assignments.splice(index, 1, {
      _id: assignmentId,
      ...assignmentUpdates,
    });
    return db.assignments[index];
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
    getAssignmentByAID,
  };
}
