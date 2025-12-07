import AssignmentsDao from "../Assignments/dao.js";

export default function AssignmentsRoutes(app) {
  const dao = AssignmentsDao();

  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const createAssignmentForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignment = { ...req.body, course: courseId };
    const newAssignment = await dao.createAssignment(assignment);
    res.json(newAssignment);
  };

  const deleteAssignmentRoute = async (req, res) => {
    const { assignmentId } = req.params;
    await dao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  };

  const updateAssignmentRoute = async (req, res) => {
    const { assignmentId } = req.params;
    const updated = await dao.updateAssignment(assignmentId, req.body);
    res.json(updated);
  };

  const fetchAssignmentByAID = async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await dao.getAssignmentByAID(assignmentId);
    res.json(assignment);
  };

  app.get("/api/assignments/:assignmentId", fetchAssignmentByAID);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.put("/api/assignments/:assignmentId", updateAssignmentRoute);
  app.delete("/api/assignments/:assignmentId", deleteAssignmentRoute);
}
