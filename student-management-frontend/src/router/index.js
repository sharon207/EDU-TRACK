import { createRouter, createWebHistory } from "vue-router";

// Auth
import LoginSelect from "../views/LoginSelect.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

// Teacher
import TeacherDashboard from "../views/TeacherDashboard.vue";
import Courses from "../views/Courses.vue";
import Subjects from "../views/Subjects.vue";
import AddStudent from "../views/AddStudent.vue";
import Attendance from "../views/Attendance.vue";
import CourseWork from "../views/CourseWork.vue";



// Student
import StudentDashboard from "../views/StudentDashboard.vue";

const routes = [
  /* ---------- AUTH ---------- */
  { path: "/", component: LoginSelect },
  { path: "/login/teacher", component: Login },
  { path: "/login/student", component: Login },
  { path: "/register", component: Register },

  /* ---------- TEACHER ---------- */
  { path: "/teacher/dashboard", component: TeacherDashboard },
  { path: "/teacher/courses", component: Courses },
  { path: "/teacher/subjects", component: Subjects },
  { path: "/teacher/add-student", component: AddStudent },
  { path: "/teacher/attendance", component: Attendance },
  { path: "/teacher/coursework/:id", component: CourseWork },

  /* ---------- STUDENT ---------- */
  { path: "/student/dashboard", component: StudentDashboard },

  /* ---------- FALLBACK ---------- */
  { path: "/:pathMatch(.*)*", redirect: "/" }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
