import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    const exists = enrollments.some(
      (e) => e.user === userId && e.course === courseId
    );
    if (!exists) {
      const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
      enrollments.push(newEnrollment);
      return newEnrollment;
    }
    return null;
  }

  function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = db;
    const index = enrollments.findIndex(
      (e) => e.user === userId && e.course === courseId
    );
    if (index !== -1) {
      const removed = enrollments.splice(index, 1)[0];
      return removed;
    }
    return null;
  }

  function getEnrollmentsForUser(userId) {
    const { enrollments } = db;
    return enrollments.filter((e) => e.user === userId);
  }

  function getUsersForCourse(courseId) {
    const { enrollments, users } = db;
    return enrollments
      .filter((e) => e.course === courseId)
      .map((e) => users.find((u) => u._id === e.user))
      .filter(Boolean);
  }

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    getEnrollmentsForUser,
    getUsersForCourse,
  };
}
