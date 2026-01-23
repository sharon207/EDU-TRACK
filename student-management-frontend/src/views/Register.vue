<template>
  <div class="h-screen flex justify-center items-center bg-gray-100">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Register</h2>

      <div class="mb-3">
        <label class="block mb-1">Name</label>
        <input
          v-model="user.name"
          type="text"
          placeholder="Full Name"
          class="w-full border p-2 rounded"
        />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Email</label>
        <!-- no browser validation -->
        <input
          v-model="user.email"
          type="text"
          placeholder="Email"
          class="w-full border p-2 rounded"
        />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Password</label>
        <input
          v-model="user.password"
          type="password"
          placeholder="Password"
          class="w-full border p-2 rounded"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Role</label>
        <select v-model="user.role" class="w-full border p-2 rounded">
          <option disabled value="">Select Role</option>
          <!-- 👇 mapped values -->
          <option value="STAFF">Teacher</option>
          <option value="STUDENT">Student</option>
        </select>
      </div>

      <button
        @click="register"
        class="bg-blue-600 text-white w-full py-2 rounded mb-3"
      >
        Register
      </button>

      <button
        @click="$router.push('/')"
        class="text-blue-600 w-full text-center"
      >
        ← Back to Login
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",

  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        role: ""
      }
    };
  },

  methods: {
    async register() {
      if (!this.user.name || !this.user.email || !this.user.password || !this.user.role) {
        alert("Please fill all fields");
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:5000/api/register",
          this.user
        );

        alert(res.data.message);

        // clear form
        this.user = {
          name: "",
          email: "",
          password: "",
          role: ""
        };

        this.$router.push("/"); // back to login select

      } catch (err) {
        alert(err.response?.data?.message || "Registration failed");
        console.error(err);
      }
    }
  }
};
</script>
