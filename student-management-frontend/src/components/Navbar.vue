<template>
  <nav>
    <!-- Show everything for teacher -->
    <template v-if="role === 'STAFF'">
      <button @click="$router.push('/teacher/dashboard')">Dashboard</button>
      <button @click="$router.push('/teacher/subjects')">Subjects</button>
      <button @click="$router.push('/teacher/attendance')">Attendance</button>
      <button class="logout-btn" @click="logout">Logout</button>
    </template>

    <!-- Show ONLY logout button for student -->
    <template v-else-if="role === 'STUDENT'">
      <button class="logout-btn" @click="logout">Logout</button>
    </template>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      role: localStorage.getItem("role")
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
    }
  }
};
</script>

<style>
nav {
  display: flex;
  gap: 10px;
}

/* Your existing styles — not touched */
</style>
