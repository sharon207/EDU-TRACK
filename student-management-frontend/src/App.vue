<template>
  <div id="app">
    <!-- Navbar -->
    <nav v-if="showNavbar" class="navbar">
      <h2>Student Management System</h2>

      <div class="nav-links">
        <!-- ================= TEACHER (STAFF) ================= -->
        <template v-if="role === 'STAFF'">
          <router-link to="/teacher/dashboard">
            Dashboard
          </router-link>

          <router-link to="/teacher/courses">
            Courses
          </router-link>

          <router-link to="/teacher/subjects">
            Subjects
          </router-link>

          <router-link to="/teacher/add-student">
            Students
          </router-link>

          <router-link to="/teacher/attendance">
            Attendance
          </router-link>
        </template>

        <!-- ================= STUDENT ================= -->
        <template v-if="role === 'STUDENT'">
          
        </template>

        <button @click="logout">Logout</button>
      </div>
    </nav>

    <!-- Page Content (DO NOT HIDE THIS) -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",

  computed: {
    role() {
      // STAFF or STUDENT
      return localStorage.getItem("role");
    },

    isLoggedIn() {
      return !!localStorage.getItem("userId");
    },

    showNavbar() {
      const hideOnRoutes = [
        "/",
        "/login/teacher",
        "/login/student",
        "/register"
      ];

      return this.isLoggedIn && !hideOnRoutes.includes(this.$route.path);
    }
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
/* Global Styles */
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f4f6f8;
}

#app {
  min-height: 100vh;
}

/* Navbar */
.navbar {
  background-color: #1e293b;
  color: white;
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar h2 {
  margin: 0;
}

/* Navigation Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.nav-links a.router-link-active {
  text-decoration: underline;
}

/* Logout Button */
button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #dc2626;
}
</style>
