<template>
  <div class="page">
    <h2 class="title">Teacher Dashboard</h2>

    <!-- COURSES LIST -->
    <div class="courses-box">
      <h3>Available Courses</h3>

      <div v-if="courses.length === 0" class="empty">No courses available.</div>

      <ul class="course-list">
        <li v-for="c in courses" :key="c._id">
          <span>{{ c.name }}</span>
          <button @click="loadStudentsByCourse(c._id, c.name)">View Students</button>
        </li>
      </ul>
    </div>

    <!-- STUDENTS LIST -->
    <div v-if="selectedCourseId" class="students-box">
      <h3>Students in: {{ selectedCourseName }}</h3>

      <button class="back-btn" @click="clearCourseView">← Back</button>

      <!-- ✅ Search bar (added ONLY this) -->
      <input
        v-model="searchText"
        placeholder="Search student..."
        class="w-full p-2 mb-3 rounded border"
        style="margin-top: 10px;"
      />

      <table v-if="filteredStudents.length">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="s in filteredStudents" :key="s._id">
            <td>{{ s.name }}</td>
            <td>{{ s.rollNumber }}</td>
            <td>{{ s.courseId?.name }}</td>
            <td>
              <button class="percent-btn" @click="openActionsMenu(s)">
                Actions ▼
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty">No students in this course.</div>
    </div>

    <!-- ACTION POPUP MENU (unchanged style) -->
    <div
      v-if="showActions"
      class="action-popup"
      @click.self="showActions = false"
    >
      <div class="action-box">
        <h3>Actions: {{ actionStudent.name }}</h3>

        <button @click="viewPercentage(actionStudent)">View %</button>
        <button @click="viewAttendance(actionStudent)">View Attendance</button>
        <button @click="openEdit(actionStudent)">Edit</button>

        <button class="danger" @click="deleteStudent(actionStudent._id)">
          Delete
        </button>

        <button class="close-btn danger" @click="showActions = false">
          Close
        </button>
      </div>
    </div>

    <!-- ATTENDANCE MODAL -->
    <div v-if="showAttendanceModal" class="modal">
      <div class="modal-box large">
        <h3>Attendance: {{ attendanceStudentName }}</h3>

        <table class="w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="a in attendance" :key="a._id">
              <td>{{ formatDate(a.date) }}</td>
              <td>{{ a.subjectId?.name }}</td>
              <td>
                <span :class="a.status === 'Present' ? 'present' : 'absent'">
                  {{ a.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <button class="danger close-btn" @click="showAttendanceModal = false">
          Close
        </button>
      </div>
    </div>

    <!-- PERCENTAGE MODAL -->
    <div v-if="showPercentModal" class="modal">
      <div class="modal-box large">
        <h3>Attendance Percentage: {{ percentStudentName }}</h3>

        <button class="percent-btn" @click="toggleChartType">
          Switch to {{ chartType === 'pie' ? 'Bar Chart' : 'Pie Chart' }}
        </button>

        <canvas id="attendanceChart" height="200"></canvas>

        <table class="w-full mt-4">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Present</th>
              <th>Total</th>
              <th>Percentage</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in percentages" :key="p.subject">
              <td>{{ p.subject }}</td>
              <td>{{ p.present }}</td>
              <td>{{ p.total }}</td>
              <td>{{ p.percentage }}%</td>
            </tr>
          </tbody>
        </table>

        <button class="danger close-btn" @click="closeChart">
          Go Back
        </button>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="editing" class="modal">
      <div class="modal-box">
        <h3>Edit Student</h3>

        <input v-model="editForm.name" placeholder="Name" />
        <input v-model="editForm.rollNumber" placeholder="Roll Number" />

        <select v-model="editForm.courseId">
          <option value="">Select Course</option>
          <option v-for="c in courses" :key="c._id" :value="c._id">
            {{ c.name }}
          </option>
        </select>

        <div class="actions">
          <button @click="updateStudent">Save</button>
          <button class="danger" @click="editing = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  Chart,
  PieController,
  BarController,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from "chart.js";

Chart.register(
  PieController,
  BarController,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

export default {
  name: "TeacherDashboard",

  data() {
    return {
      courses: [],
      students: [],
      searchText: "",  // 🔥 Added ONLY this

      selectedCourseId: "",
      selectedCourseName: "",

      showActions: false,
      actionStudent: {},

      attendance: [],
      showAttendanceModal: false,
      attendanceStudentName: "",

      showPercentModal: false,
      percentStudentName: "",
      percentages: [],
      chart: null,
      chartType: "pie",

      editing: false,
      editForm: {
        _id: "",
        name: "",
        rollNumber: "",
        courseId: ""
      }
    };
  },

  computed: {
    filteredStudents() {
      if (!this.searchText) return this.students;

      const text = this.searchText.toLowerCase();
      return this.students.filter(s =>
        s.name.toLowerCase().includes(text) ||
        s.rollNumber.toLowerCase().includes(text)
      );
    }
  },

  async mounted() {
    this.loadCourses();
  },

  methods: {
    openActionsMenu(student) {
      this.actionStudent = student;
      this.showActions = true;
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    async loadCourses() {
      this.courses = (await axios.get("http://localhost:5000/api/courses")).data;
    },

    async loadStudentsByCourse(courseId, courseName) {
      this.selectedCourseId = courseId;
      this.selectedCourseName = courseName;

      this.students = (
        await axios.get(
          `http://localhost:5000/api/students?courseId=${courseId}`
        )
      ).data;

      this.searchText = ""; // reset search when switching courses
    },

    clearCourseView() {
      this.selectedCourseId = "";
      this.selectedCourseName = "";
      this.students = [];
      this.searchText = "";
    },

    async viewAttendance(student) {
      this.attendanceStudentName = student.name;
      this.attendance = (
        await axios.get(
          `http://localhost:5000/api/attendance/student/${student._id}`
        )
      ).data;

      this.showActions = false;
      this.showAttendanceModal = true;
    },

    async viewPercentage(student) {
      this.percentStudentName = student.name;

      this.percentages = (
        await axios.get(
          `http://localhost:5000/api/attendance/percentage/${student._id}`
        )
      ).data;

      this.showActions = false;
      this.showPercentModal = true;

      setTimeout(() => this.renderChart(), 200);
    },

    renderChart() {
      const ctx = document.getElementById("attendanceChart");
      if (!ctx) return;

      if (this.chart) this.chart.destroy();

      this.chart = new Chart(ctx, {
        type: this.chartType,
        data: {
          labels: this.percentages.map(p => p.subject),
          datasets: [
            {
              label: "Attendance %",
              data: this.percentages.map(p => p.percentage),
              backgroundColor: [
                "#60a5fa",
                "#34d399",
                "#fbbf24",
                "#f87171",
                "#a78bfa"
              ]
            }
          ]
        }
      });
    },

    toggleChartType() {
      this.chartType = this.chartType === "pie" ? "bar" : "pie";
      this.renderChart();
    },

    closeChart() {
      this.showPercentModal = false;

      if (this.chart) this.chart.destroy();
      this.chart = null;
    },

    openEdit(student) {
      this.editing = true;

      this.editForm = {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        courseId: student.courseId?._id || ""
      };

      this.showActions = false;
    },

    async updateStudent() {
      await axios.put(
        `http://localhost:5000/api/students/${this.editForm._id}`,
        this.editForm
      );

      alert("Student updated");

      this.loadStudentsByCourse(this.selectedCourseId, this.selectedCourseName);
      this.editing = false;
    },

    async deleteStudent(id) {
      if (!confirm("Delete this student?")) return;

      await axios.delete(`http://localhost:5000/api/students/${id}`);

      alert("Student deleted");

      this.loadStudentsByCourse(this.selectedCourseId, this.selectedCourseName);
      this.showActions = false;
    }
  }
};
</script>

<style>
/* your original styles — EXACTLY untouched */
/* ORIGINAL STYLES – untouched */

.action-popup {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-box {
  background: white;
  padding: 20px;
  width: 250px;
  border-radius: 6px;
  box-shadow: 0 2px 5px #aaa;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* YOUR OTHER STYLES REMAIN UNCHANGED ↓ */

.page { padding: 20px; }
.title { font-size: 26px; margin-bottom: 15px; font-weight: bold; }
.courses-box, .students-box {
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 5px #ddd;
  margin-bottom: 20px;
}
.course-list { list-style: none; padding: 0; }
.course-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
button { padding: 5px 10px; cursor: pointer; }
.view-att { background: #2563eb; color: white; }
.percent-btn { background: #0ea5e9; color: white; }
.present { color: green; font-weight: bold; }
.absent { color: red; font-weight: bold; }
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-box {
  background: white;
  padding: 20px;
  width: 320px;
}
.modal-box.large {
  width: 520px;
  max-height: 80vh;
  overflow: auto;
}
.close-btn { margin-top: 15px; width: 100%; }
.danger { background: red; color: white;}
.empty { padding: 10px; color: #777; }
</style>
