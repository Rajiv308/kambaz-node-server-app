import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import EnrollmentModel from "../Enrollments/model.js";
export default function CoursesDao() {
  function findAllCourses() {
    return model.find(
      {},
      { name: 1, description: 1, number: 1, imgLocation: 1 }
    );
  }
  async function findCoursesForEnrolledUser(userId) {
    const enrollments = await EnrollmentModel.find({ user: userId });

    const courseIds = enrollments.map((e) => e.course);
    const courses = await model.find(
      { _id: { $in: courseIds } },
      { name: 1, description: 1, number: 1, imgLocation: 1 }
    );

    return courses;
  }

  async function findCourseById(courseId) {
    return model.findById(courseId);
  }

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  }
  function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId });
  }
  function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
    findCourseById,
  };
}
