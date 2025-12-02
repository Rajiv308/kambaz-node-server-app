import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  const enrollmentsDao = EnrollmentsDao();

  const enrollUser = async (req, res) => {
    let { userId, courseId } = req.params;
    console.log("Enroll request for user:", userId, "in course:", courseId);
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.send(status);
  };

  const unenrollUser = async (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(
      userId,
      courseId
    );
    res.send(status);
  };

  const unenrollUserFromAllCourses = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromAllCourses(userId);
    res.send(status);
  };

  const unenrollAllUsersFromCourse = async (req, res) => {
    const { courseId } = req.params;
    const status = await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    res.send(status);
  };

  const getEnrollmentsForUser = async (req, res) => {
    const { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  const getUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const { role, name } = req.query;
    if (role) {
      const users = await enrollmentsDao.findEnrolledUsersByRole(
        courseId,
        role
      );
      res.json(users);
      return;
    }
    if (name) {
      const users = await enrollmentsDao.findEnrolledUsersByPartialName(
        courseId,
        name
      );
      res.json(users);
      return;
    }
    const users = await enrollmentsDao.findUsersForCourse(courseId);
    res.json(users);
  };

  app.delete("/api/enrollments/courses/:courseId", unenrollAllUsersFromCourse);
  app.delete("/api/enrollments/users/:userId", unenrollUserFromAllCourses);
  app.delete("/api/enrollments/:userId/:courseId", unenrollUser);
  app.post("/api/enrollments/:userId/:courseId", enrollUser);
  app.get("/api/users/:userId/enrollments", getEnrollmentsForUser);
  app.get("/api/courses/:courseId/users", getUsersForCourse);
}
