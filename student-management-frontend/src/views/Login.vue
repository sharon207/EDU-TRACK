<template>
  <div class="h-screen flex justify-center items-center bg-gray-100">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">
        {{ roleTitle }} Login
      </h2>

      <div class="mb-3">
        <label class="block mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border p-2 rounded"
          required
        />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border p-2 rounded"
          required
        />
      </div>

      <button
        @click="login"
        class="bg-blue-600 text-white w-full py-2 rounded mb-3"
      >
        Login
      </button>

      <!-- REGISTER BUTTON ONLY FOR TEACHER LOGIN -->
      <button
        v-if="roleTitle === 'Teacher'"
        @click="$router.push('/register')"
        class="text-blue-600 w-full text-center"
      >
        Register
      </button>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      roleTitle: "",
    };
  },

  mounted() {
    if (this.$route.path.includes("teacher")) {
      this.roleTitle = "Teacher";
    } else if (this.$route.path.includes("student")) {
      this.roleTitle = "Student";
    }
  },

  methods: {
    async login() {
      try {
        const res = await axios.post("http://localhost:5000/api/login", {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name || "");

        alert("Login successful");

        if (res.data.role === "STAFF") {
          this.$router.push("/teacher/dashboard");
        } else if (res.data.role === "STUDENT") {
          this.$router.push("/student/dashboard");
        }

      } catch (err) {
        alert(err.response?.data?.message || "Login failed");
      }
    },
  },
};
</script>

<style scoped>
body {
  background: #f5f5f5;
}
</style>
