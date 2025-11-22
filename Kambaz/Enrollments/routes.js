import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const enrollUser = (req, res) => {
    const { userId, courseId } = req.params;
    const enrollment = dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  };

  const unenrollUser = (req, res) => {
    const { userId, courseId } = req.params;
    const removed = dao.unenrollUserFromCourse(userId, courseId);
    res.json(removed);
  };

  const getEnrollmentsForUser = (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.getEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  const getUsersForCourse = (req, res) => {
    const { courseId } = req.params;
    const users = dao.getUsersForCourse(courseId);
    res.json(users);
  };

  app.post("/api/enrollments/:userId/:courseId", enrollUser);
  app.delete("/api/enrollments/:userId/:courseId", unenrollUser);
  app.get("/api/users/:userId/enrollments", getEnrollmentsForUser);
  app.get("/api/courses/:courseId/users", getUsersForCourse);
}
