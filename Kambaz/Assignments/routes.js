import AssignmentsDao from "../Assignments/dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    res.json(dao.findAssignmentsForCourse(courseId));
  };

  const createAssignmentForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignment = { ...req.body, course: courseId };
    const newAssignment = dao.createAssignment(assignment);
    console.log(newAssignment);
    res.json(newAssignment);
  };

  const deleteAssignmentRoute = (req, res) => {
    const { assignmentId } = req.params;
    dao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  };

  const updateAssignmentRoute = (req, res) => {
    const { assignmentId } = req.params;
    const updated = dao.updateAssignment(assignmentId, req.body);
    res.json(updated);
  };

  const fetchAssignmentByAID = (req, res) => {
    const { assignmentId } = req.params;
    const assignment = dao.getAssignmentByAID(assignmentId);
    res.json(assignment);
  };

  app.get("/api/assignments/:assignmentId", fetchAssignmentByAID);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.put("/api/assignments/:assignmentId", updateAssignmentRoute);
  app.delete("/api/assignments/:assignmentId", deleteAssignmentRoute);
}
