<template>
  <div class="page">
    <h2>Add Student</h2>

    <form @submit.prevent="addStudent">
      
      <!-- 🔍 SEARCH USER -->
      <input
        v-model="userSearch"
        placeholder="Search user by name or email"
        @input="filterUsers"
      />

      <!-- USER DROPDOWN -->
      <select v-model="userId" required>
        <option value="">Select Student User</option>

        <option 
          v-for="u in filteredUsers" 
          :key="u._id" 
          :value="u._id">
          {{ u.name }} ({{ u.email }})
        </option>
      </select>

      <input v-model="name" placeholder="Student Name" required />
      <input v-model="rollNumber" placeholder="Roll Number" required />

      <!-- COURSE DROPDOWN -->
      <select v-model="courseId" required>
        <option value="">Select Course</option>

        <option 
          v-for="c in courses" 
          :key="c._id" 
          :value="c._id">
          {{ c.name }}
        </option>
      </select>

      <input v-model="phone" placeholder="Phone" />
      <input v-model="address" placeholder="Address" />

      <button type="submit">Add Student</button>

    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AddStudent",

  data() {
    return {
      userId: "",
      userSearch: "",
      users: [],
      filteredUsers: [],

      name: "",
      rollNumber: "",
      courseId: "",
      phone: "",
      address: "",

      courses: []
    };
  },

  async mounted() {
    try {
      // LOAD ALL STUDENT USERS
      const resUsers = await axios.get("http://localhost:5000/api/users/students");
      this.users = resUsers.data;
      this.filteredUsers = resUsers.data;

      // LOAD COURSES
      const resCourses = await axios.get("http://localhost:5000/api/courses");
      this.courses = resCourses.data;

    } catch (err) {
      console.error("Failed loading data", err);
    }
  },

  methods: {
    filterUsers() {
      const term = this.userSearch.toLowerCase();

      this.filteredUsers = this.users.filter(u =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    },

    async addStudent() {
      if (!this.userId) {
        alert("Please select a user");
        return;
      }

      try {
        await axios.post("http://localhost:5000/api/students", {
          userId: this.userId,
          name: this.name,
          rollNumber: this.rollNumber,
          courseId: this.courseId,
          phone: this.phone,
          address: this.address
        });

        alert("Student added successfully");
        this.$router.push("/teacher/dashboard");

      } catch (err) {
        console.error("Add Student Error", err);
        alert("Failed to add student");
      }
    }
  }
};
</script>

<style scoped>
.page {
  padding: 20px;
  max-width: 400px;
}

input,
select {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 6px;
}

button {
  padding: 8px 12px;
}
</style>
