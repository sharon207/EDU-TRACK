<template>
  <div class="page">
    <h2>Mark Attendance</h2>

    <!-- Select Course -->
    <select v-model="courseId" @change="loadCourseData">
      <option value="">Select Course</option>
      <option
        v-for="c in courses"
        :key="c._id"
        :value="c._id"
      >
        {{ c.name }}
      </option>
    </select>

    <!-- Select Subject -->
    <select v-model="subjectId" :disabled="!courseId">
      <option value="">Select Subject</option>
      <option
        v-for="s in subjects"
        :key="s._id"
        :value="s._id"
      >
        {{ s.name }}
      </option>
    </select>

    <!-- Select Date (RESTRICTED BY COURSE DURATION) -->
    <input
      type="date"
      v-model="date"
      :min="selectedCourse?.startDate"
      :max="selectedCourse?.endDate"
      :disabled="!selectedCourse"
    />

    <!-- Students List -->
    <table v-if="students.length">
      <thead>
        <tr>
          <th>Student</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="s in students" :key="s._id">
          <td>{{ s.name }}</td>
          <td>
            <select v-model="attendance[s._id]">
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <button
      @click="saveAttendance"
      :disabled="!courseId || !subjectId || !date"
    >
      Save Attendance
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Attendance",

  data() {
    return {
      courses: [],
      subjects: [],
      students: [],

      courseId: "",
      subjectId: "",
      date: "",

      selectedCourse: null,
      attendance: {}
    };
  },

  async mounted() {
    // Load all courses
    const res = await axios.get("http://localhost:5000/api/courses");
    this.courses = res.data;
  },

  methods: {
    async loadCourseData() {
      this.subjectId = "";
      this.subjects = [];
      this.students = [];
      this.attendance = {};
      this.date = "";
      this.selectedCourse = null;

      // 🔹 Get selected course details
      const courseRes = await axios.get("http://localhost:5000/api/courses");
      this.selectedCourse = courseRes.data.find(
        c => c._id === this.courseId
      );

      // 🔹 Load subjects of selected course
      const subjectRes = await axios.get(
        `http://localhost:5000/api/subjects/${this.courseId}`
      );
      this.subjects = subjectRes.data;

      // 🔹 Load students registered in selected course
      const studentRes = await axios.get(
        `http://localhost:5000/api/students?courseId=${this.courseId}`
      );
      this.students = studentRes.data;

      // 🔹 Default attendance = Present
      this.students.forEach(s => {
        this.attendance[s._id] = "Present";
      });
    },

    async saveAttendance() {
      const payload = this.students.map(s => ({
        studentId: s._id,
        subjectId: this.subjectId,
        date: this.date,
        status: this.attendance[s._id]
      }));

      await axios.post(
        "http://localhost:5000/api/attendance",
        payload
      );

      alert("Attendance saved successfully");
    }
  }
};
</script>

<style>
.page {
  padding: 20px;
  max-width: 700px;
}

select,
input {
  width: 100%;
  padding: 6px;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
}
</style>

