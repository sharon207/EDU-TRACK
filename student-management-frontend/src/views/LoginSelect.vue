<template>
  <div class="login-select">
    <h1>Student Management System</h1>

    <div class="buttons">
      <router-link to="/login/teacher">
        <button class="teacher">Teacher Login</button>
      </router-link>

      <router-link to="/login/student">
        <button class="student">Student Login</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginSelect"
};
</script>

<style>
.login-select {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.buttons {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

button {
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 6px;
}

.teacher {
  background-color: #001bea;
  color: white;
}

.student {
  background-color: #5de000;
  color: white;
}
</style>
