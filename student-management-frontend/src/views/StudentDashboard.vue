<template>
  <div class="page">
    <h2 class="title">Student Dashboard</h2>

    <!-- PROFILE BOX -->
    <div class="students-box">
      <h3>My Profile</h3>

      <p><strong>Name:</strong> {{ student.name }}</p>
      <p><strong>Roll Number:</strong> {{ student.rollNumber }}</p>
      <p><strong>Course:</strong> {{ student.courseId?.name }}</p>

      <button class="percent-btn" @click="viewPercentage">
        View Attendance %
      </button>
    </div>

    <!-- ATTENDANCE TABLE -->
    <div class="students-box">
      <h3>My Attendance</h3>

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
    </div>

    <!-- PERCENTAGE MODAL -->
    <div v-if="showPercentModal" class="modal">
      <div class="modal-box large">

        <button class="back-btn" @click="closeChart">← Back</button>

        <h3>Attendance Percentage</h3>

        <!-- CHART -->
        <canvas id="studentChart" height="200"></canvas>

        <!-- TABLE -->
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

        <!-- TOGGLE BUTTON -->
        <button class="percent-btn" @click="toggleChart">
          Switch to {{ chartType === 'pie' ? 'Bar' : 'Pie' }} Chart
        </button>

        <button class="danger close-btn" @click="closeChart">
          Close
        </button>
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
  PieController, BarController,
  ArcElement, BarElement,
  Tooltip, Legend,
  CategoryScale, LinearScale
);

export default {
  name: "StudentDashboard",

  data() {
    return {
      student: {},
      attendance: [],

      showPercentModal: false,
      percentages: [],
      chart: null,
      chartType: "pie" // OR "bar"
    };
  },

  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    async loadStudent() {
      const userId = localStorage.getItem("userId");

      const profileRes = await axios.get(
        `http://localhost:5000/api/student/user/${userId}`
      );
      this.student = profileRes.data;

      const attRes = await axios.get(
        `http://localhost:5000/api/attendance/student/${this.student._id}`
      );
      this.attendance = attRes.data;
    },

    async viewPercentage() {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/percentage/${this.student._id}`
      );
      this.percentages = res.data;

      this.showPercentModal = true;

      this.$nextTick(() => this.renderChart());
    },

    toggleChart() {
      this.chartType = this.chartType === "pie" ? "bar" : "pie";
      this.renderChart();
    },

    renderChart() {
      const ctx = document.getElementById("studentChart");

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
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "bottom" } }
        }
      });
    },

    closeChart() {
      this.showPercentModal = false;
      if (this.chart) this.chart.destroy();
      this.chart = null;
      this.chartType = "pie";
    }
  },

  async mounted() {
    this.loadStudent();
  }
};
</script>

<style scoped>
.present { color: green; font-weight: bold; }
.absent { color: red; font-weight: bold; }
</style>
