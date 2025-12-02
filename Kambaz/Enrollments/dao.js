import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function EnrollmentsDao() {
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }
  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }
  function enrollUserInCourse(userId, courseId) {
    return model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
  }
  function unenrollUserFromCourse(user, course) {
    return model.deleteOne({ user, course });
  }
  function unenrollUserFromAllCourses(userId) {
    return model.deleteMany({ user: userId });
  }
  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  async function findEnrolledUsersByRole(courseId, role) {
    const enrollments = await model.find({ course: courseId }).populate({
      path: "user",
      match: { role: role },
    });

    return enrollments.map((e) => e.user).filter((u) => u !== null);
  }

  async function findEnrolledUsersByPartialName(courseId, name) {
    const regex = new RegExp(name, "i");

    const result = await model.aggregate([
      { $match: { course: courseId } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          $or: [
            { "user.firstName": regex },
            { "user.lastName": regex },
            { "user.username": regex },
          ],
        },
      },
      { $replaceRoot: { newRoot: "$user" } },
    ]);

    return result;
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
    unenrollUserFromAllCourses,
    findEnrolledUsersByRole,
    findEnrolledUsersByPartialName,
  };
}
