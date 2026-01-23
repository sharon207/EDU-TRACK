<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Edit Student</h1>

    <!-- SELECT USER ACCOUNT -->
    <label class="block mb-1 font-semibold">Student User Account</label>
    <select v-model="student.userId" class="border p-2 mb-3 w-full">
      <option value="">Select student account</option>
      <option v-for="u in users" :key="u._id" :value="u._id">
        {{ u.name }} ({{ u.email }})
      </option>
    </select>

    <input v-model="student.name" placeholder="Name" class="border p-2 mb-2 w-full" />
    <input v-model="student.rollNumber" placeholder="Roll Number" class="border p-2 mb-2 w-full" />
    <input v-model="student.course" placeholder="Course" class="border p-2 mb-4 w-full" />

    <button
      @click="updateStudent"
      class="bg-green-600 text-white px-4 py-2 rounded"
    >
      Update Student
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      student: {
        userId: "",
        name: "",
        rollNumber: "",
        course: "",
      },
      users: [],
    };
  },

  async mounted() {
    const studentId = this.$route.params.id;

    // Load student data
    const studentRes = await axios.get(
      `http://localhost:5000/api/students/${studentId}`
    );
    this.student = studentRes.data;

    // Load student users
    const usersRes = await axios.get(
      "http://localhost:5000/api/users/students"
    );
    this.users = usersRes.data;
  },

  methods: {
    async updateStudent() {
      if (!this.student.userId) {
        alert("Please assign a student user account");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/students/${this.student._id}`,
        this.student
      );

      alert("Student updated successfully");
      this.$router.push("/teacher/dashboard");
    },
  },
};
</script>
