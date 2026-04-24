// student.api.js
import API from "./axios";

// GET ALL STUDENTS  ← params (page, limit, sortBy, sortDir, search, status, year) are now forwarded
export const fetchStudents = async (params = {}) => {
  const res = await API.get("/students", { params });
  return res.data;
};

// CREATE STUDENT
export const createStudent = (data) => API.post("/students", data);

// UPDATE STUDENT
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);

// DELETE STUDENT
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// BULK DELETE STUDENTS
export const bulkDeleteStudents = (ids) =>
  API.post("/students/bulk-delete", { ids });

// REGISTER STUDENT USER (if separate route exists)
export const registerStudentUser = async (data) => {
  return await API.post("/auth/register", data);
};

// 📌 Get all enrollments of a student
export const fetchStudentEnrollments = async (studentId) => {
  const res = await API.get(`/enrollments/student/${studentId}`);
  return res.data;
};

// 📌 Get all grades of a student
export const fetchStudentGrades = async (studentId) => {
  const res = await API.get(`/grades/student/${studentId}`);
  return res.data;
};

// 📌 Get all attendance of a student
export const fetchStudentAttendance = async (studentId) => {
  const res = await API.get(`/attendance/student/${studentId}`);
  return res.data;
};
